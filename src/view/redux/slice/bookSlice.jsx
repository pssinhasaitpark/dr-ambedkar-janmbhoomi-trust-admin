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

export const saveBooksToBackend = createAsyncThunk(
  "books/saveBooksToBackend",
  async (booksData, { rejectWithValue }) => {
    try {
      const response = await api.post("/books", booksData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    updateBooks: (state, action) => {
      state.title = action.payload?.title || "Books";
      state.name = action.payload?.name || "";
      state.description = action.payload?.description || ""; 
      state.images = action.payload?.images || [];
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { updateBooks } = booksSlice.actions;
export default booksSlice.reducer;
