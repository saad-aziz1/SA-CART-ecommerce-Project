import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/ConnectDB.js'
import userRouter from './Routers/userRouters.js'
import cookieParser from 'cookie-parser'
dotenv.config()
import cors from 'cors'

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/user', userRouter)


const port = process.env.PORT || 5000
app.listen(port,()=>{
    dbConnect()
    console.log(`Server Connected at ${port}`);
})