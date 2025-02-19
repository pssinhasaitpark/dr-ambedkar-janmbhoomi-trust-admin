import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "",
  name: "",
  biography: "",
  images: [],
  status: "idle",
  error: null,
};

// Fetch About Data
export const fetchAboutData = createAsyncThunk("about/fetchAboutData", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/biography");
    console.log("API Response:", response.data);
    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching About data:", error);
    return rejectWithValue(error.response?.data || "Error fetching data");
  }
});

// Save About Data
export const saveAboutToBackend = createAsyncThunk("about/saveAboutToBackend", async (aboutData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/biography/add", aboutData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Save API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving About data:", error);
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(saveAboutToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveAboutToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
