import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

export const fetchContactData = createAsyncThunk(
  "contact/fetchContactData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact");
      console.log("Fetched contact data", response.data);
      return response.data.data; // Corrected to return the array
    } catch (error) {
      console.log("Error fetching contact data", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload; // Store the array
      })
      .addCase(fetchContactData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
