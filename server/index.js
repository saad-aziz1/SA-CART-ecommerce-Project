import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/ConnectDB.js'
dotenv.config()

const app = express()

const port = process.env.PORT || 5000
app.listen(()=>{
    dbConnect()
    console.log(`Server Connected at ${port}`);
})