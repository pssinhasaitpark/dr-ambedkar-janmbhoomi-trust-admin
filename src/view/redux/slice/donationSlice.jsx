import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Donation",
  name: "",
  description: "", 
  images: [], 
  status: "idle",
  error: null,
};

export const saveDonationToBackend = createAsyncThunk(
  "donation/saveDonationToBackend",
  async (donationData, { rejectWithValue }) => {
    try {
      const response = await api.post("/donation", donationData, {
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

const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    updateDonation: (state, action) => {
      state.title = action.payload?.title || "Donation";
      state.name = action.payload?.name || "";
      state.description = action.payload?.description || ""; 
      state.images = action.payload?.images || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDonationToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveDonationToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Donation";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(saveDonationToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateDonation } = donationSlice.actions;
export default donationSlice.reducer;
