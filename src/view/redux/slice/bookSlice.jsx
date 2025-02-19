import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Books",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
};

export const fetchBooksData = createAsyncThunk(
  "books/fetchBooksData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/books");
      console.log("Fetched Books Data:", response.data.data);
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching books data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveBooksToBackend = createAsyncThunk(
  "books/saveBooksToBackend",
  async (booksData, { rejectWithValue }) => {
    try {
      const response = await api.post("/books", booksData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Saved Books Data:", response.data.data);
      return response.data.data || {};
    } catch (error) {
      console.error("Error saving books data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooksData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Books";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(fetchBooksData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveBooksToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveBooksToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Books";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(saveBooksToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default booksSlice.reducer;
