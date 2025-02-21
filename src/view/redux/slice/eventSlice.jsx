import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Events",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Events from backend
export const fetchEventsData = createAsyncThunk(
  "events/fetchEventsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/events");
      // console.log("Fetched event Data:", response.data.events);
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching events data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Events data to backend
export const saveEventsToBackend = createAsyncThunk(
  "events/saveEventsToBackend",
  async ({ id, eventsData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", eventsData.title);
      formData.append("name", eventsData.name);

      // Ensure description is properly trimmed
      formData.append(
        "description",
        eventsData.description?.trim() || "No description provided"
      );

      // Append only image files (not URLs)
      eventsData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      // Ensure `removeImages` is only appended if it has values
      if (eventsData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(eventsData.removeImages)
        );
      }

      const endpoint = id ? `/events?id=${id}` : "/events";
      console.log("Sending Data:", Object.fromEntries(formData));

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Saved events Data:", response.data.data);
      return response.data.data || {};
    } catch (error) {
      console.error("Error saving events data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEventsData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default eventSlice.reducer;
