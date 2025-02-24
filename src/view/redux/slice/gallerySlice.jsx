import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Gallery",
  name: "",
  description: "",
  birthplace_media: [],
  events_media: [],
  exhibitions_media: [],
  online_media: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Gallery data from backend
export const fetchGalleryData = createAsyncThunk(
  "gallery/fetchGalleryData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/gallery");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Gallery data to backend
export const saveGalleryToBackend = createAsyncThunk(
  "gallery/saveGalleryToBackend",
  async ({ id, galleryData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", galleryData.title);
      formData.append("name", galleryData.name);
      
      formData.append(
        "description",
        galleryData.description?.trim() || "No description provided"
      );
      
      ["birthplace_media", "events_media", "exhibitions_media", "online_media"].forEach((field) => {
        if (galleryData[field]) {
          galleryData[field].forEach((file) => {
            if (file instanceof File) {
              formData.append(field, file);
            }
          });
        }
      });

      if (galleryData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(galleryData.removeImages)
        );
      }

      const endpoint = id ? `/gallery?id=${id}` : "/gallery";
      
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving gallery data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGalleryData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default gallerySlice.reducer;
