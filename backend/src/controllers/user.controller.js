import asyncHandler  from "../utils/asyncHandler.js"
import APIerror from "../utils/ApiError.js"
import APIresponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
const generateRefreshAndAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessTokens()
        const refreshToken = user.generateRefreshTokens()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken }
    } catch (error) {
        throw new APIerror(500, "Something went wrong while genrating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {  userName, password } = req.body
    if (userName == "") {
        throw new APIerror(400, "UserName is required !!")
    }
    if (password == "") {
        throw new APIerror(400, "Password is required !!")
    }

    const uniqueUser = await User.findOne({
        $or: [{ userName }],
    })
    if (uniqueUser) {
        throw new APIerror(409, "User already exists ")
    }
    // const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    // if (!avatarLocalPath) {
    //     throw new APIerror(400, "Avatar image is required")
    // }
    // const avatarUpload = await uploadToCloudinary(avatarLocalPath)
    // const coverImageUpload = await uploadToCloudinary(coverImageLocalPath)
    // if (!avatarUpload) {
    //     throw new APIerror(400, " Avatar is required")
    // }
    const user = await User.create({
        userName,
        password,
    })
    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!isUserCreated) {
        throw new APIerror(
            500,
            "Something went wrong while registering the user"
        )
    }
    return res
        .status(200)
        .json(new APIresponse(200, isUserCreated, "User created successfully"))
})
const loginUser = asyncHandler(async (req, res) => {
    const { userName,  password } = req.body

    if (!(userName )) {
        throw new APIerror(400, "UserName  is required")
    }
    const getUser = await User.findOne({
        $or: [{ userName }],
    })
    if (!getUser) {
        throw new APIerror(404, "User not found")
    }
    const isPasswordCorrect = await getUser.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new APIerror(401, "Password Incorrect")
    }
    const { refreshToken, accessToken } = await generateRefreshAndAccessTokens(
        getUser._id
    )
    const userLoginStatus = await User.findById(getUser._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIresponse(
                200,
                {
                    user: userLoginStatus,
                    accessToken,
                    refreshToken,
                },
                "User logged in succesfully"
            )
        )
})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._conditions._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new APIresponse(200, {}, "User logged Out"))
})
const getRefreshToken = asyncHandler(async (req, res) => {
    const gettingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken
    if (!gettingRefreshToken) {
        throw new APIerror(401, "Unauthorised request")
    }
    try {
        const decodedToken = jwt.verify(
            gettingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new APIerror(401, "Cannot find user (Invalid refresh token)")
        }
        if (gettingRefreshToken != user.refreshToken) {
            throw new APIerror(401, "Refresh token expired or is invalid")
        }
        const { accessToken, newRefreshToken } = generateRefreshAndAccessTokens(
            user._id
        )
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new APIresponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new APIerror(401, error.message || "Invalid refresh token")
    }
})
const changePassword = asyncHandler(async (req, res) => {
    const { password, newPassword } = req.body
    const user = await User.findById(req.user._conditions._id)
    const checkingOldPassword = await user.isPasswordCorrect(password)
    if (!checkingOldPassword) {
        throw new APIerror(400, "Current password is incorrect")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new APIresponse(200, {}, "Password updated successfully"))
})
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._conditions._id).select(
        "-password -refreshToken"
    )
    return res
        .status(200)
        .json(new APIresponse(200, user, "User fetched Successfully "))
})
export{
    registerUser,
    loginUser,
    logoutUser,
    getRefreshToken,
    changePassword,
    getCurrentUser
}