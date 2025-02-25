import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Axios instance

// Fetch all books
export const fetchBooks = createAsyncThunk(
  "booklist/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/booklist");
      return response.data.data.map((book) => ({
        id: book._id,
        title: book.book_title,
        author: book.author_name,
        description: book.description,
        images: book.images || [],
      }));
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add a new book
export const addBook = createAsyncThunk(
  "booklist/addBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await api.post("/booklist", bookData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const book = response.data;
      
      return {
        id: book._id,
        title: book.book_title,
        author: book.author_name,
        description: book.description,
        images: book.images || [],
      };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Update a book
export const updateBook = createAsyncThunk(
  "booklist/updateBook",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/booklist/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const book = response.data;
      return {
        id: book._id,
        title: book.book_title,
        author: book.author_name,
        description: book.description,
        images: book.images || [],
      };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Delete a book
export const deleteBook = createAsyncThunk(
  "booklist/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/booklist/${id}`);
      return id; // Return the deleted book ID
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Book Slice
const bookSlice = createSlice({
  name: "booklist",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book.id !== action.payload);
      });

  },
});

export default bookSlice.reducer;
