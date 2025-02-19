import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios";

const initialState = {
  title: "Donations",
  name: "",
  description: "",
  images: [],
  status: "idle",
  error: null,
};

export const fetchDonationData = createAsyncThunk(
  "donation/fetchDonationData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/donation");
      console.log("Fetched Donation Data:", response.data.data);
      return response.data.data[0] || {};
    } catch (error) {
      console.error("Error fetching donation data:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveDonationToBackend = createAsyncThunk(
  "donation/saveDonationToBackend",
  async (donationData, { rejectWithValue }) => {
    try {
      const response = await api.post("/donation", donationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Saved Donation Data:", response.data.data);
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
    builder
      .addCase(fetchDonationData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDonationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Donations";
        state.name = action.payload?.name || "";
        state.description = action.payload?.description || "";
        state.images = action.payload?.images || [];
      })
      .addCase(fetchDonationData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveDonationToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveDonationToBackend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload?.title || "Donations";
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

export default donationSlice.reducer;