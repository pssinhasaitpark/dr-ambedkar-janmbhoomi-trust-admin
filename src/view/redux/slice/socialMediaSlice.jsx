import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

// Fetch all social media links
export const fetchSocialMedia = createAsyncThunk(
  "socialMedia/fetch",
  async () => {
    const response = await api.get("/socialmedia");
    // console.log("Fetched Social Media Data:", response.data);
    return response.data.data;
  }
);

// Update social media links (entire object)
export const updateSocialMedia = createAsyncThunk(
  "socialMedia/update",
  async ({ id, updatedLinks }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(updatedLinks).forEach((key) => {
        formData.append(key, updatedLinks[key]);
      });

      const response = await api.put(`/socialmedia/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);


const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState: {
    links: {}, 
    id: null, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?._id) {
          state.id = action.payload._id;
          state.links = action.payload;
        } else {
          state.error = "API response is missing _id.";
          console.error(state.error);
        }
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSocialMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(updateSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default socialMediaSlice.reducer;
