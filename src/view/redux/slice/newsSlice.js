import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "News",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch News data from backend
export const fetchNewsData = createAsyncThunk(
  "news/fetchNewsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/news");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching news data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update News data to backend
export const saveNewsToBackend = createAsyncThunk(
  "news/saveNewsToBackend",
  async ({ id, newsData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", newsData.title);
      formData.append("name", newsData.name);
      
      formData.append(
        "description",
        newsData.description?.trim() || "No description provided"
      );
      
      newsData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      if (newsData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(newsData.removeImages)
        );
      }

      const endpoint = id ? `/news?id=${id}` : "/news";
      
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving news data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNewsData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default newsSlice.reducer;
