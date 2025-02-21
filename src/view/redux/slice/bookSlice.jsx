import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Books",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Books from backend
export const fetchBooksData = createAsyncThunk(
  "books/fetchBooksData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/books");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching books data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Books data to backend
export const saveBooksToBackend = createAsyncThunk(
  "books/saveBooksToBackend",
  async ({ id, booksData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", booksData.title);
      formData.append("name", booksData.name);
      formData.append(
        "description",
        booksData.description?.trim() || "No description provided"
      );

      // Append only image files (not URLs)
      booksData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      // Ensure `removeImages` is only appended if it has values
      if (booksData.removeImages?.length > 0) {
        formData.append("removeImages", JSON.stringify(booksData.removeImages));
      }

      const endpoint = id ? `/books?id=${id}` : "/books";
      console.log("Sending Data:", Object.fromEntries(formData));

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Saved books Data:", response.data.data);
      return response.data.data || {};
    } catch (error) {
      console.error("Error saving books data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBooksData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default bookSlice.reducer;