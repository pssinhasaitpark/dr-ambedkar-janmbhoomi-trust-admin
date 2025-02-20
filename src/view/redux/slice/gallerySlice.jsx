// redux/slice/gallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  gallery_info: "",
  gallery_description: "",
  birthplace_media: [],
  events_media: [],
  exhibitions_media: [],
  online_media: [],
  status: "idle",
  error: null,
};

export const fetchGalleryData = createAsyncThunk(
  "gallery/fetchGalleryData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/gallery");
      return response.data.data || {};
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch gallery data");
    }
  }
);

export const saveGalleryToBackend = createAsyncThunk(
  "gallery/saveGalleryToBackend",
  async (galleryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/gallery", galleryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data || {};
    } catch (error) {
      console.error("Error saving gallery data:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to save gallery data");
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGalleryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchGalleryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveGalleryToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveGalleryToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(saveGalleryToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default gallerySlice.reducer;
