import express from 'express'
import { addToCart, getCart } from '../controllers/cartController.js'
import { isAuthorized } from '../middleware/authMiddleware.js'

const cartRouter = express.Router()

// --- USER CART ROUTES ---

// 1: Add or Update Cart Item
// User ka login hona lazmi hy isliye isAuthorized pehle aayega
cartRouter.post('/add', isAuthorized, addToCart)

// 2: Get All Cart Items for logged in user
cartRouter.get('/all', isAuthorized, getCart)

export default cartRouter