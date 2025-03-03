import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  testimonials: [],
  loading: false,
  error: null,
};

export const fetchTestimonialsData = createAsyncThunk(
  "testimonials/fetchTestimonialsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/testimonials");
      return response.data.data.testimonials; // Extracting the testimonials array
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonialsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonialsData.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload; // Store testimonials data
      })
      .addCase(fetchTestimonialsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testimonialSlice.reducer;
