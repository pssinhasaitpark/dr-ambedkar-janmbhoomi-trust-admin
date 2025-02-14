import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";
import { toast } from "react-toastify";

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData);
      const { encryptedToken, user_role } = response.data;

      // Check if the user role is "user" (not allowed)
      if (user_role === "user") {
        return rejectWithValue("Access denied! Only admins can log in.");
      }

      localStorage.setItem("token", encryptedToken);
      localStorage.setItem("userRole", user_role);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  return null;
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    userRole: localStorage.getItem("userRole") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.encryptedToken;
        state.user = action.payload.user;
        state.userRole = action.payload.user_role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        // Show toast notification if access is denied
        if (action.payload === "Access denied! Only admins can log in.") {
          toast.error(action.payload, { position: "top-right" });
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.userRole = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
