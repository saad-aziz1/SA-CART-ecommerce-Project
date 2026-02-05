import express from 'express'
import { SignUp } from '../controllers/userControllers.js'
import { verifyEmail } from '../controllers/emailVrifyController.js'

const userRouter = express.Router()

userRouter.post('/signup',SignUp)
userRouter.get('/verify-email',verifyEmail)

export default userRouter