import express from 'express'
import { forgotPassword, getAllUsers, getMyProfile, getUserByID, googleLogin, logIn, logOut, resetPassword, SignUp, updateUserRole } from '../controllers/userControllers.js'
import { verifyEmail } from '../controllers/emailVrifyController.js'
import { isAuthorized } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminAuth.js'

const userRouter = express.Router()

// --- Public Routes ---
userRouter.post('/signup', SignUp)
userRouter.get('/verify-email', verifyEmail)
userRouter.post('/login', logIn)
userRouter.post('/googlelogin', googleLogin)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/logout', logOut)

// --- User (Authenticated) Routes ---
userRouter.get('/profile', isAuthorized, getMyProfile)

// --- Admin Only Routes ---
// Yaad rakhen: Inhen hamesha wildcard (/:id) se ooper rakhen
userRouter.get('/admin/users', isAuthorized, isAdmin, getAllUsers)

// Is path ko professional banane ke liye '/admin/user/:id' kar dena behtar hai
userRouter.get('/admin/user/:id', isAuthorized, isAdmin, getUserByID)

// Naya route add karen
userRouter.put('/admin/user/:id', isAuthorized, isAdmin, updateUserRole);

export default userRouter