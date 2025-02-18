import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axios/axios';  // Replace with your actual axios instance

const initialState = {
  title: '', // Title of the About section
  name: '',  // Name of the person or entity in the About section
  biography: '',  // Biography content
  images: [], // Array to hold the images (if applicable)
  status: 'idle',  // Loading state
  error: null,  // Error state
};

// Async thunk for fetching About data from the backend
export const fetchAboutData = createAsyncThunk(
  'about/fetchAboutData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/biography');  // Replace with the correct endpoint
      return response.data;  // Assuming your backend returns the About data in the `data` key
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || 'Error fetching About data'
      );
    }
  }
);

// Async thunk for saving About data to the backend
export const saveAboutToBackend = createAsyncThunk(
  'about/saveAboutToBackend',
  async (aboutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/biography', aboutData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,  // Add token for authentication if necessary
        },
      });
      return response.data;  // Assuming the API returns the saved data in `data` key
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || 'Something went wrong while saving'
      );
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    // Optional: A reducer to manually update the About data in the store
    updateAbout: (state, action) => {
      state.title = action.payload.title;
      state.name = action.payload.name;
      state.biography = action.payload.biography;
      state.images = action.payload.images;
    },
    clearAboutData: (state) => {
      state.title = '';
      state.name = '';
      state.biography = '';
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    // Handle fetching About data
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming the data returned from the backend has keys: title, name, biography, and images
        const { title, name, biography, images } = action.payload;
        state.title = title || '';
        state.name = name || '';
        state.biography = biography || '';
        state.images = images || [];
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // Handle saving About data
    builder
      .addCase(saveAboutToBackend.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveAboutToBackend.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally, update the state with the saved data from backend
        const { title, name, biography, images } = action.payload;
        state.title = title || '';
        state.name = name || '';
        state.biography = biography || '';
        state.images = images || [];
      })
      .addCase(saveAboutToBackend.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { updateAbout, clearAboutData } = aboutSlice.actions;
export default aboutSlice.reducer;
