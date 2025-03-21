import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Logout action to clear token and user data
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { dispatch }) => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  dispatch(resetAuth());

  setTimeout(() => {
    window.location.href = "/login"; 
  }, 100);
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
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;
    });
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
