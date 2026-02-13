import Cart from '../models/cartModel.js'; 

// --- ADD TO CART / UPDATE CART ---
export const addToCart = async (req, res) => {
    try {
        const { cartItems } = req.body; 
        const userId = req.user._id;   

       
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Check karo product pehle se cart array mein hy ya nahi
            const isItemExist = cart.cartItems.find(
                (item) => item.product.toString() === cartItems.product.toString()
            );

            if (isItemExist) {
                
                cart.cartItems = cart.cartItems.map((item) =>
                    item.product.toString() === isItemExist.product.toString() 
                    ? cartItems 
                    : item
                );
            } else {
                
                cart.cartItems.push(cartItems);
            }

            await cart.save();
            return res.status(200).json({ success: true, cart });

        } else {
            
            const newCart = await Cart.create({
                user: userId,
                cartItems: [cartItems]
            });

            return res.status(201).json({ success: true, cart: newCart });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET USER'S CART ---
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
           
            return res.status(200).json({ success: true, cartItems: [] });
        }

        res.status(200).json({ success: true, cartItems: cart.cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};