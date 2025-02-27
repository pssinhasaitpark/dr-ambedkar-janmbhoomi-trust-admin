import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Axios instance

// Fetch all events
export const fetchEvents = createAsyncThunk(
  "eventlist/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/eventlist");
      return response.data.data.map((event) => ({
        id: event._id,
        event_title: event.event_title,
        organized_by: event.organized_by,
        description: event.description,
        images: event.images || [],
      }));
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Add a new event
export const addEvent = createAsyncThunk(
  "eventlist/addEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/events", eventData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const event = response.data;
      
      return {
        id: event._id,
        event_title: event.event_title,
        organized_by: event.organized_by,
        description: event.description,
        images: event.images || [],
      };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update an event
export const updateEvent = createAsyncThunk(
  "eventlist/updateEvent",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/eventlist/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const event = response.data;
      return {
        id: event._id,
        event_title: event.event_title,
        organized_by: event.organized_by,
        description: event.description,
        images: event.images || [],
      };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Delete an event
export const deleteEvent = createAsyncThunk(
  "eventlist/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/eventlist/${id}`);
      return id; // Return the deleted event ID
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Event Slice
const eventSlice = createSlice({
  name: "eventlist",
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
