import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null
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
    getProductsFail, 
    clearErrors 
} = productSlice.actions;

export default productSlice.reducer;