import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Event",
  name: "",
  description: "", 
  images: [], 
  status: "idle",
  error: null,
};

export const saveEventToBackend = createAsyncThunk(
  "event/saveEventToBackend",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/events", eventData, {
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

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateEvent: (state, action) => {
      state.title = action.payload?.title || "Event";
      state.name = action.payload?.name || "";
      state.description = action.payload?.description || ""; 
      state.images = action.payload?.images || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveEventToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveEventToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Event";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(saveEventToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateEvent } = eventSlice.actions;
export default eventSlice.reducer;
