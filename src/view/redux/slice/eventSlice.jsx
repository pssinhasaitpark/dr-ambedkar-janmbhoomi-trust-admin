import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Event Title",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Events data from backend
export const fetchEventData = createAsyncThunk(
  "events/fetchEventData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/events");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching Event data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Event data to backend
export const saveEventToBackend = createAsyncThunk(
  "events/saveEventToBackend",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("name", eventData.name);
      formData.append("description", eventData.description);
      

      eventData.images.forEach((image) => {
        formData.append("images", image);
      });

      const endpoint = id ? `/events?id=${id}` : "/events";

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving Event data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Event Title";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
        state._id = action.payload?._id || null;
      })
      .addCase(fetchEventData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveEventToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveEventToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Event Title";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
        state._id = action.payload?._id || null;
      })
      .addCase(saveEventToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default eventsSlice.reducer;
