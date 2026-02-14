import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    // 1: Add or Update Item
    addItemsToCart: (state, action) => {
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

    // 2: Remove Single Item
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 3: Save Shipping Address
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },

    // 4: CLEAR CART (Naya logic order ke baad ke liye)
    clearCart: (state) => {
      state.cartItems = []; // State khali
      localStorage.removeItem("cartItems"); // LocalStorage khali
    },

    // 5: Sync Data
    fetchCart: (state) => {
      const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        state.cartItems = JSON.parse(storedItems);
      }
    },
  },
});

// --- EXPORTS ---
export const { 
    addItemsToCart, 
    removeItemFromCart, 
    saveShippingInfo, 
    clearCart, // Naya export
    fetchCart 
} = cartSlice.actions;

// Aliases for compatibility
export const addToCart = addItemsToCart;
export const removeFromCart = removeItemFromCart;

export default cartSlice.reducer;