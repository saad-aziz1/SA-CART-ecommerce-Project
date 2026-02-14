import Product from "../models/productModels.js"
import {v2 as cloudinary} from 'cloudinary'
import ApiFeatures from "../utils/apiFeatures.js"

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

// --- GET ALL PRODUCTS (Enhanced with Search & Filter) ---
// --- GET ALL PRODUCTS (Enhanced with Search & Filter) ---
export const getAllProducts = async (req, res) => {
    try {
        const resultPerPage = 8; // Ek page par kitne products dikhane hain
        const productsCount = await Product.countDocuments(); // Database me total products kitne hain

        // 1. ApiFeatures initialize karna
        const apiFeature = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter();

        // 2. Filtered products ka count nikalna (Pagination se pehle)
        // Hum clone() isliye use karte hain taake asal query kharab na ho
        let filteredProducts = await apiFeature.query.clone();
        const filteredProductsCount = filteredProducts.length;

        // 3. Ab Pagination apply karna
        apiFeature.pagination(resultPerPage);

        // 4. Final products list hasil karna (Final Execution)
        const products = await apiFeature.query;

        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount, // Frontend ke liye lazmi hai
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
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


// --- CREATE NEW REVIEW OR UPDATE THE REVIEW ---
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    // Check kro kya user ne pehle review diya hy?
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      // Agar pehle review mojud hy, toh usay update kro
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      // Agar naya review hy, toh array me push kro
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Average Rating calculate krna
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};