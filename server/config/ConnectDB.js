import mongoose from "mongoose";

const dbConnect = async () => {
   try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("DB Connected at Cloud");
    
   } catch (error) {
    console.log("DB Connection Error",error);
    
   }
}
export default dbConnect