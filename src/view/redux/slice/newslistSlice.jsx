import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Axios instance

// Fetch all news
export const fetchNews = createAsyncThunk(
  "newslist/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/news");
      return response.data.data.map((news) => ({
        id: news._id,
        latest_news: news.latest_news,
        headline: news.headline,
        description: news.description,
        images: news.images || [],
      }));
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add a new news article
export const addNews = createAsyncThunk(
  "newslist/addNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const response = await api.post("/news", newsData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const news = response.data;
      
      return {
        id: news._id,
        latest_news: news.latest_news,
        headline: news.headline,
        description: news.description,
        images: news.images || [],
      };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update a news article
export const updateNews = createAsyncThunk(
  "newslist/updateNews",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/news/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const news = response.data;
      return {
        id: news._id,
        latest_news: news.latest_news,
        headline: news.headline,
        description: news.description,
        images: news.images || [],
      };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Delete a news article
export const deleteNews = createAsyncThunk(
  "newslist/deleteNews",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/news/${id}`);
      return id; // Return the deleted news ID
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// News Slice
const newsSlice = createSlice({
  name: "newslist",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.news.push(action.payload);
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        const index = state.news.findIndex((news) => news.id === action.payload.id);
        if (index !== -1) {
          state.news[index] = action.payload;
        }
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.news = state.news.filter((news) => news.id !== action.payload);
      });
  },
});

export default newsSlice.reducer;