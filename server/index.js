import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/ConnectDB.js'
import userRouter from './Routers/userRouters.js'
import cookieParser from 'cookie-parser'
dotenv.config()
import cors from 'cors'
import productRouter from './Routers/productRouter.js'
import connectCloudinary from './config/cloudinary.js'
import cartRouter from './Routers/cartRouter.js';

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/user', userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter);



const port = process.env.PORT || 5000
app.listen(port,()=>{
    dbConnect()
    connectCloudinary()
    console.log(`Server Connected at ${port}`);
})