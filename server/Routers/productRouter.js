import express from 'express'
import { createProduct, getAllProducts, getProductDetails } from '../controllers/productController.js'


const productRouter = express.Router()
productRouter.get('/products', getAllProducts)
productRouter.post('/products/new', createProduct)
productRouter.get('/product/:id', getProductDetails)

export default productRouter