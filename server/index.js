import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/ConnectDB.js'
import userRouter from './Routers/userRouters.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/user', userRouter)

const port = process.env.PORT || 5000
app.listen(port,()=>{
    dbConnect()
    console.log(`Server Connected at ${port}`);
})