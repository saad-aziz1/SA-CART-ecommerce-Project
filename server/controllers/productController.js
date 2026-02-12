import Product from "../models/productModels.js"
import {v2 as cloudinary} from 'cloudinary'

// createNewProduct(Admin)
export const createProduct = async (req, res) => {
    try {
        const {name, description, price, category, stock, features} =req.body

        const files = req.files

        if(!files || files.length === 0) {
            return res.status(400).json({
                success:false,
                message:"Please Upload at least one image"
            })
        }

        const imagesUploadPromise = files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products", 
            });
        });

        const uploadResults = await Promise.all(imagesUploadPromise);

        const imagesUrls = uploadResults.map((result) => {
            return {
                public_id: result.public_id,
                url: result.secure_url
            };
        });

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            features, 
            images: imagesUrls,
            user: req.user._id 
        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
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




// --- 2: DELETE PRODUCT (Admin) ---
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // --- CLOUDINARY CLEANUP ---
        // Pehle images delete karenge Cloudinary se
        for (let i = 0; i < product.images.length; i++) {
            // Hum .v2.uploader ki jagah direct .uploader use karenge import ke mutabiq
            await cloudinary.uploader.destroy(product.images[i].public_id);
        }

        // Database se delete karna
        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });
    } catch (error) {
        // Taake console mein detail nazar aaye error ki
        console.log("Delete Error:", error); 
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};