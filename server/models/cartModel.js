import mongoose from 'mongoose';

// --- CART SCHEMA DESIGN ---
const cartSchema = new mongoose.Schema({
    // 1: Kis user ka cart hy? (Relation with User Model)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 2: Cart mein konsi items hain? (Array of Objects)
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            stock: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model creation and Export
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;