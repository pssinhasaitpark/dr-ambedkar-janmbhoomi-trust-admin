import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "About",
  name: "",
  biography: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
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

// Save or Update About data to backend
export const saveAboutToBackend = createAsyncThunk(
  "about/saveAboutToBackend",
  async ({ id, aboutData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", aboutData.title);
      formData.append("name", aboutData.name);
      formData.append("biography", aboutData.biography);

      aboutData.images.forEach((image) => {
        formData.append("images", image);
      });

      const endpoint = id ? `/biography/add?id=${id}` : "/biography/add";

      const response = await api.post(endpoint, formData, {
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
        state.images = action.payload?.images || [];
        state._id = action.payload?._id || null;
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
        state.images = action.payload?.images || [];
        state._id = action.payload?._id || null;
      })
      .addCase(saveAboutToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
