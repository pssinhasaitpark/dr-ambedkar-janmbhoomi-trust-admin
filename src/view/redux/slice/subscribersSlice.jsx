import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Import the Axios instance

// Async thunk to fetch subscribers
export const fetchSubscribers = createAsyncThunk("subscribers/fetchSubscribers", async () => {
  const response = await api.get("/newsletter");
  return response.data.subscribers;
});

const subscribersSlice = createSlice({
  name: "subscribers",
  initialState: {
    data: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default subscribersSlice.reducer;
