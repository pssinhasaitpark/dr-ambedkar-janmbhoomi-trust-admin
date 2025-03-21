import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  role: "",
  full_name: "",
  user_name: "",
  user_role: "",
  email: "",
  mobile: "",
  loading: false,
  error: null,
};

export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      
      // Ensure response has expected structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid API response structure");
      }

      return response.data.data;
    } catch (error) {
      console.error("Profile API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile data");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        const { full_name, user_name, user_role, email, mobile } = action.payload || {};

        state.role = user_role || "";
        state.full_name = full_name || "";
        state.user_name = user_name || "";
        state.user_role = user_role || "";
        state.email = email || "";
        state.mobile = mobile || "";
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default profileSlice.reducer;
