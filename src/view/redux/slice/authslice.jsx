import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Logout action using Redux and clearing localStorage
export const logoutUser = createAsyncThunk("user/logoutUser", async (_, { dispatch }) => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    dispatch(resetAuth()); // Reset Redux state after logout

    console.log("Logout: localStorage cleared");

    setTimeout(() => {
      window.location.href = "/login"; // Redirect to login after clearing data
    }, 100);
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

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
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.userRole = null;
      });
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
