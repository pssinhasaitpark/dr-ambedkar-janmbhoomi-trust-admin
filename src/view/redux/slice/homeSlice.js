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

// Post or update home data
export const submitHomeData = createAsyncThunk(
  "home/submitHomeData",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct headers for file upload
        },
      };
      const response = id
        ? await api.put(`/banner/${id}`, formData, config) // Update if ID exists
        : await api.post("/banner/add", formData, config); // Create new if no ID
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
