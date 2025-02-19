import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "News",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
};

export const fetchNewsData = createAsyncThunk(
  "news/fetchNewsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/news");
    //   console.log("Fetched News Data:", response.data);
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching news data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveNewsToBackend = createAsyncThunk(
  "news/saveNewsToBackend",
  async (newsData, { rejectWithValue }) => {
    try {
      const response = await api.post("/news", newsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    //   console.log("Saved News Data:", response.data.data);
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
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "News";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveNewsToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveNewsToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "News";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(saveNewsToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;