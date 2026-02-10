import Product from "../models/productModels.js"

// createNewProduct(Admin)
export const createProduct = async (req,res) => {
    try {
        const product = await Product.create(req.body)

        res.status(201).json({
            success:true,
            product
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

//allProductsAxios
export const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find()

        res.status(201).json({
            success:true,
            products
        })  
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

//oneProductDetails
export const getProductDetails = async (req, res) => {
    try {
        
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ 
                message: "Product not found"
             })
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};