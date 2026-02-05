import express from 'express'
import { getMyProfile, logIn, logOut, SignUp } from '../controllers/userControllers.js'
import { verifyEmail } from '../controllers/emailVrifyController.js'
import { isAuthorized } from '../middleware/authMiddleware.js'

const userRouter = express.Router()

userRouter.post('/signup',SignUp)
userRouter.get('/verify-email',verifyEmail)
userRouter.post('/login',logIn)
userRouter.get('/profile', isAuthorized, getMyProfile)
userRouter.get('/logout', logOut)



export default userRouter