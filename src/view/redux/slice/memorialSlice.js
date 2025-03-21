import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Axios instance

// Async thunk to submit form data
export const submitMemorialData = createAsyncThunk(
  "memorial/submitMemorialData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/banner/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Submission failed");
    }
  }
);

// Async thunk to update existing data
export const updateMemorialData = createAsyncThunk(
  "memorial/updateMemorialData",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/banner/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

const memorialSlice = createSlice({
  name: "memorial",
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitMemorialData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitMemorialData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(submitMemorialData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMemorialData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMemorialData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateMemorialData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default memorialSlice.reducer;
