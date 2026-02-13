import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'; // Naya kaam: axios import kiya

// 1: LocalStorage se purana data nikalna
const initialCartItems = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: initialCartItems,
  },
  reducers: {
    // NAYA KAAM: Backend se pura cart load karne ke liye
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 2: Add to Cart Logic (Same as your original)
    addToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find((i) => i.product === item.product);

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 3: Remove from Cart (Same as your original)
    removeFromCart: (state, action) => {
      const idToRemove = String(action.payload);
      state.cartItems = state.cartItems.filter(
        (i) => String(i.product) !== idToRemove
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

// Naming wahi hain jo aapki file mein thin
export const { addToCart, removeFromCart, setCartItems } = cartSlice.actions;

// --- NAYA KAAM: THUNK ACTIONS FOR BACKEND SYNC ---

// A: Database mein save karne ke liye
export const addItemsToCart = (item) => async (dispatch) => {
  dispatch(addToCart(item)); // Pehle local update
  try {
    await axios.post('http://localhost:3000/api/cart/add', 
      { cartItems: item }, 
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Backend Sync Error:", error);
  }
};

// B: Database se cart mangwane ke liye
export const fetchCart = () => async (dispatch) => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/cart/all', { withCredentials: true });
    if (data.success) {
      dispatch(setCartItems(data.cartItems));
    }
  } catch (error) {
    console.error("Fetch Cart Error:", error);
  }
};

export default cartSlice.reducer;