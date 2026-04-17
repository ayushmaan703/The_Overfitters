import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosinstance";

const initialState = {
  loading: false,
  status: false,
  userData: null,
};
export const createAccount = createAsyncThunk("createAccount", async (data) => {
  try {
    const response = await axiosInstance.post("/user/register", data);
    toast.success("Registered Succcessfully");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const userLogin = createAsyncThunk("login", async (data) => {
  try {
    const response = await axiosInstance.post("/user/login", data, {
      withCredentials: true,
    });
    toast.success("Logged in successfully");
    return response.data.data.user;
  } catch (error) {
    console.log(error);
    
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
export const userLogout = createAsyncThunk("logout", async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    toast.success("User logged out");
    return response.data?.message;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const predict = createAsyncThunk("predict", async () => {
  try {
    const response = await axiosInstance.post("/user/predict");
    toast.success("Prediction completed");
    return response.data?.message;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const userRefreshToken = createAsyncThunk(
  "refreshToken",
  async (data) => {
    try {
      const response = await axiosInstance.post("/user/refresh-token", data);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const changePassword = createAsyncThunk(
  "changePassword",
  async (data) => {
    try {
      const response = await axiosInstance.post("/user/change-password", data);
      toast.success("Password changed successfully");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const currentUserInfo = createAsyncThunk("currentUserInfo", async () => {
  try {
    const response = await axiosInstance.post("/user/current-user", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
});
export const updateUserDetails = createAsyncThunk(
  "updateUserDetails",
  async (data) => {
    try {
      const response = await axiosInstance.patch("/user/update-details", data);
      toast.success("Details updated sucessfully");
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createAccount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAccount.fulfilled, (state) => {
      state.loading = false;
    });
    // builder.addCase(createAccount.rejected, (state) => {
    //   state.loading = false;
    // });
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(userLogout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });
    builder.addCase(currentUserInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(currentUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(currentUserInfo.rejected, (state) => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });
    builder.addCase(updateUserDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
  },
});
export default authSlice.reducer;
