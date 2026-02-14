import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
    // --- PAGINATION STATES ADDED ---
    productsCount: 0,
    resultPerPage: 0,
    filteredProductsCount: 0,
    isUpdated: false 
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
            // Backend se pura data (action.payload) mil raha hai
            state.products = action.payload.products;
            state.productsCount = action.payload.productsCount;
            state.resultPerPage = action.payload.resultPerPage;
            state.filteredProductsCount = action.payload.filteredProductsCount;
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
            state.isUpdated = action.payload; 
        },

        newReviewFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        newReviewReset: (state) => {
            state.isUpdated = false;
        },

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
    newReviewRequest,
    newReviewSuccess,
    newReviewFail,
    newReviewReset,
    getProductsFail, 
    clearErrors 
} = productSlice.actions;

export default productSlice.reducer;