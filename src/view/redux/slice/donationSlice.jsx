import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Donation",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
  _id: null,
};

// Fetch Donation data from backend
export const fetchDonationData = createAsyncThunk(
  "donation/fetchDonationData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/donation");
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching donation data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save or Update Donation data to backend
export const saveDonationToBackend = createAsyncThunk(
  "donation/saveDonationToBackend",
  async ({ id, donationData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", donationData.title);
      formData.append("name", donationData.name);
      
      formData.append(
        "description",
        donationData.description?.trim() || "No description provided"
      );
      
      donationData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      if (donationData.removeImages?.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(donationData.removeImages)
        );
      }

      const endpoint = id ? `/donation?id=${id}` : "/donation";
      
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || {};
    } catch (error) {
      console.error("Error saving donation data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDonationData.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  },
});

export default donationSlice.reducer;
