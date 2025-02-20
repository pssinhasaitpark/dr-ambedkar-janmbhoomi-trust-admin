import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "About",
  name: "",
  biography: "",
  images: [],
  status: "idle",
  error: null,
};

// Fetch About data from backend
export const fetchAboutData = createAsyncThunk(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/biography");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching About data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save About data to backend
export const saveAboutToBackend = createAsyncThunk(
  "about/saveAboutToBackend",
  async (aboutData, { rejectWithValue }) => {
    try {
      const response = await api.post("/biography/add", aboutData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data || {};
    } catch (error) {
      console.error("Error saving About data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "About";
        state.name = action.payload?.name || "";
        state.biography = action.payload?.biography || "";
        state.images = action.payload?.images || "";
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveAboutToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAboutToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "About";
        state.name = action.payload?.name || "";
        state.biography = action.payload?.biography || "";
        state.images = action.payload?.images || "";
      })
      .addCase(saveAboutToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
