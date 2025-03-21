import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Import the Axios instance

// Async thunk to fetch donation collection data
export const fetchDonations = createAsyncThunk(
  "donations/fetchDonations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/collection"); // Update API endpoint accordingly
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch donations");
    }
  }
);

const donationCollectionSlice = createSlice({
  name: "donations",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default donationCollectionSlice.reducer;
