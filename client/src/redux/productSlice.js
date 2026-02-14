import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
    isUpdated: false // Naya review check karne ke liye
}

const productSlice = createSlice({
    name: "products",
    initialState,   
    reducers: {
        
        getProductRequest: (state) => {
            state.loading = true;
        },

        getProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
        },

        getProductDetailsSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload.product;
        },

        // --- NEW REVIEW REDUCERS ---
        newReviewRequest: (state) => {
            state.loading = true;
        },

        newReviewSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = action.payload; // success: true aye ga
        },

        newReviewFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        newReviewReset: (state) => {
            state.isUpdated = false;
        },
        // ---------------------------

        getProductsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearErrors: (state) => {
            state.error = null;
        }
    }
});

export const { 
    getProductRequest, 
    getProductsSuccess, 
    getProductDetailsSuccess,
    newReviewRequest,    // export kiya
    newReviewSuccess,    // export kiya
    newReviewFail,       // export kiya
    newReviewReset,      // export kiya
    getProductsFail, 
    clearErrors 
} = productSlice.actions;

export default productSlice.reducer;