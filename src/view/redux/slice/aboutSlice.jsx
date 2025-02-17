import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "About Dr. Ambedkar",
  name: "Dr. Bhimrao Ambedkar",
  biography: "",
  images: [],  // Changed to 'images' instead of 'image_urls'
  status: "idle",
  error: null,
};

export const saveAboutToBackend = createAsyncThunk(
  "about/saveAboutToBackend",
  async (aboutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/biography/add", aboutData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    updateAbout: (state, action) => {
      state.title = action.payload.title;
      state.name = action.payload.name;
      state.biography = action.payload.biography;
      state.images = action.payload.images;  
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAboutToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAboutToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload.title;
        state.name = action.payload.name;
        state.biography = action.payload.biography;
        state.images = action.payload.images;  
      })
      .addCase(saveAboutToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateAbout } = aboutSlice.actions;
export default aboutSlice.reducer;
