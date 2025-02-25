import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "About",
  name: "",
  biography: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch About data from backend
export const fetchAboutData = createAsyncThunk(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/biography");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching about data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update About data to backend
export const saveAboutToBackend = createAsyncThunk(
  "about/saveAboutToBackend",
  async ({ id, aboutData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", aboutData.title);
      formData.append("name", aboutData.name);
      formData.append(
        "biography",
        aboutData.biography?.trim() || "No biography provided"
      );

      aboutData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      if (aboutData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(aboutData.removeImages)
        );
      }

      const endpoint = id ? `/biography/add?id=${id}` : "/biography/add";
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving about data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAboutData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default aboutSlice.reducer;
