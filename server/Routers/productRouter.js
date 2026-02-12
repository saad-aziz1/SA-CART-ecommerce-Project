import express from 'express'
import { 
    createProduct, 
    getAllProducts, 
    getProductDetails,  
    deleteProduct 
} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import { authorizeRoles, isAuthorized } from '../middleware/authMiddleware.js'

const productRouter = express.Router()

// --- PUBLIC ROUTES ---
productRouter.get('/products', getAllProducts)
productRouter.get('/product/:id', getProductDetails)

// --- ADMIN ROUTES ---

// 1: Create Product (Aapka pehle wala route)
productRouter.post('/admin/product/new', isAuthorized, upload.array('images', 8), createProduct)



// 3: Delete Product (Aapke style mein alag line)
// Is mein hum DELETE method use kar rahe hain
productRouter.delete('/admin/product/:id', isAuthorized,authorizeRoles("admin"), deleteProduct)

export default productRouter