import express from 'express'
import { forgotPassword, getAllUsers, getMyProfile, getUserByID, logIn, logOut, resetPassword, SignUp } from '../controllers/userControllers.js'
import { verifyEmail } from '../controllers/emailVrifyController.js'
import { isAuthorized } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminAuth.js'

const userRouter = express.Router()

userRouter.post('/signup',SignUp)
userRouter.get('/verify-email',verifyEmail)
userRouter.post('/login',logIn)
userRouter.get('/profile', isAuthorized, getMyProfile)
userRouter.get('/logout', logOut)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/admin/users', isAuthorized, isAdmin, getAllUsers)
userRouter.get('/:id',isAuthorized,isAdmin,getUserByID)


export default userRouter