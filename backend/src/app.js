import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(
    cors({
        origin: [
            "https://videotubefrontend.netlify.app",
        ],
        credentials: true, 
        methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
        allowedHeaders: "Content-Type,Authorization",
    })
)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"

app.get("/", (res) => {
    res.send("Welcome to the overfitter API")
})

app.use("/api/v1/user", userRouter)

export default app
