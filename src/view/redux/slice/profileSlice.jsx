import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  role: "",
  first_name: "",
  last_name: "",
  user_name: "",
  email: "",
  mobile: "",
  loading: false,
  error: null,
};



export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("Fetching profile data...");
      const response = await api.get("/user/me");
      // console.log("Profile API Response:", response);
      return response.data.data;
    } catch (error) {
      console.error("Profile API Error:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Unknown error");
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
        state.role = action.payload.user_role;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.user_name = action.payload.user_name;
        state.email = action.payload.email;
        state.mobile = action.payload.mobile;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
