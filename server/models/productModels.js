import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Product Name is required"],
        trim:true
    },
    description:{
        type:String,
        required:[true, "Description is required"]
    },
    price:{
        type:Number,
        required:[true, "Price is required"],
        maxlength:[8,"Price cannot exceed 8 figures"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    features: [
    {
        type: String,
        trim: true
    }
    ],
    category:{
        type:String,
        required:[true, "Please Select category for this Product"]
    },
    stock:{
        type:Number,
        required:[true, "Please Enter Product Stock"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment :{
            type:String,
            required:true
        }
    }
    ],
    createdAt:{
            type:Date,
            default: Date.now
        }

},{timestamps:true})

const Product = mongoose.model("Product", productSchema)
export default Product