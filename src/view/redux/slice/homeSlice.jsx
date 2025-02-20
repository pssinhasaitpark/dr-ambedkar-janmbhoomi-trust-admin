import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Import the configured axios instance

// Fetch home data
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/banner/getAll"); // Use api instance
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching home data");
    }
  }
);

// Post new home data
export const submitHomeData = createAsyncThunk(
  "home/submitHomeData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/banner/add", formData); // Use api instance
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error submitting home data");
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    homeData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeData = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitHomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeData = action.payload;
      })
      .addCase(submitHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default homeSlice.reducer;
