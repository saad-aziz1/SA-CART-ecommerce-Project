import express from 'express'
import { 
    createProduct, 
    getAllProducts, 
    getProductDetails,  
    deleteProduct,
    createProductReview // Naya controller import kiya
} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import { authorizeRoles, isAuthorized } from '../middleware/authMiddleware.js'

const productRouter = express.Router()

// --- PUBLIC ROUTES ---
productRouter.get('/products', getAllProducts)
productRouter.get('/product/:id', getProductDetails)

// --- REGISTERED USER ROUTES ---
// Review add ya update karne ke liye
productRouter.put('/review', isAuthorized, createProductReview)

// --- ADMIN ROUTES ---

// 1: Create Product
productRouter.post('/admin/product/new', isAuthorized, authorizeRoles("admin"), upload.array('images', 8), createProduct)

// 3: Delete Product
productRouter.delete('/admin/product/:id', isAuthorized, authorizeRoles("admin"), deleteProduct)

export default productRouter