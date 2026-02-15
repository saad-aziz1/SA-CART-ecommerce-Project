import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api"; // Axios instance use kiya

// --- LOAD USER THUNK ---
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      // BaseURL aur withCredentials ab 'api' instance handle kar raha hy
      const { data } = await api.get("/api/user/me"); 
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load user");
    }
  }
);

// --- UPDATE PROFILE THUNK ---
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" }, // ✅ JSON friendly
      };

      // localhost ka link khatam, sirf route path rakha hy
      const { data } = await api.put(
        "/api/user/me/update",
        userData,
        config
      );

      return data; // { success: true, user: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
  users: [],
  loading: false,
  error: null,
  isUpdated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
    updateProfileReset: (state) => {
      state.isUpdated = false;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        localStorage.removeItem("user");
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthUser, logoutUser, updateProfileReset, clearErrors } = authSlice.actions;
export default authSlice.reducer;