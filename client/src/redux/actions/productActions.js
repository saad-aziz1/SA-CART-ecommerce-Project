// productActions.js
import axios from 'axios';
import { 
    newReviewRequest, 
    newReviewSuccess, 
    newReviewFail,
    clearErrors 
} from '../productSlice';

// --- SUBMIT NEW REVIEW ---
export const submitReview = (reviewData) => async (dispatch) => {
    try {
        // 1: Request start
        dispatch(newReviewRequest());

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true // Cookies (Token) bhejny ke liye
        };

        // 2: API Call (PUT method)
        const { data } = await axios.put(
            `http://localhost:3000/api/product/review`, 
            reviewData, 
            config
        );

        // 3: Success! 
        dispatch(newReviewSuccess(data.success));

    } catch (error) {
        // 4: Error handling
        dispatch(newReviewFail(
            error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message
        ));
    }
};

// Clear Errors function (agar pehle se nahi hy)
export const clearReviewErrors = () => async (dispatch) => {
    dispatch(clearErrors());
};