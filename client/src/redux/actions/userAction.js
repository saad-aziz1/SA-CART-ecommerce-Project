import api from '../../utils/api'; // Axios instance 

// Get All Users (Admin)
export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: "ALL_USERS_REQUEST" });

        // Backend API 
        const { data } = await api.get("/api/user/admin/users");

        dispatch({
            type: "ALL_USERS_SUCCESS",
            payload: data.users,
        });
    } catch (error) {
        dispatch({
            type: "ALL_USERS_FAIL",
            payload: error.response.data.message,
        });
    }
};