import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios/axios"; // Axios instance

// Fetch Trustees
export const fetchTrustees = createAsyncThunk(
  "trustee/fetchTrustees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/trustee");
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trustees"
      );
    }
  }
);

// Register a New Trustee
export const registerTrustee = createAsyncThunk(
  "trustee/registerTrustee",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/user/register", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchTrustees()); // Refresh list after adding
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add trustee"
      );
    }
  }
);

// Update Trustee
export const updateTrustee = createAsyncThunk(
  "trustee/updateTrustee",
  async ({ _id, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      // console.log("Updating trustee with ID:", _id);
      // console.log("Updated Data (Before Sending):", updatedData);

      // Ensure _id is not in FormData
      for (let pair of updatedData.entries()) {
        if (pair[0] === "_id") {
          // console.log("Removing _id from FormData before sending.");
          updatedData.delete("_id");
        }
      }

      // console.log("Final FormData Entries Before API Call:");
      // for (let pair of updatedData.entries()) {
      //   console.log(pair[0], pair[1]); // Debugging
      // }

      const response = await api.put(`/user/${_id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(fetchTrustees()); // Refresh list after updating
      return response.data?.data;
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update trustee"
      );
    }
  }
);

// Delete Trustee
export const deleteTrustee = createAsyncThunk(
  "trustee/deleteTrustee",
  async (_id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/user/${_id}`);
      dispatch(fetchTrustees()); // Refresh list after deleting
      return _id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete trustee"
      );
    }
  }
);

// Trustee Slice
const trusteeSlice = createSlice({
  name: "trustee",
  initialState: {
    trustees: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trustees
      .addCase(fetchTrustees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrustees.fulfilled, (state, action) => {
        state.loading = false;
        state.trustees = action.payload;
      })
      .addCase(fetchTrustees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Trustee
      .addCase(registerTrustee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerTrustee.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Trustee added successfully!";
      })
      .addCase(registerTrustee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Trustee
      .addCase(updateTrustee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateTrustee.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Trustee updated successfully!";
      })
      .addCase(updateTrustee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Trustee
      .addCase(deleteTrustee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteTrustee.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Trustee deleted successfully!";
      })
      .addCase(deleteTrustee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = trusteeSlice.actions;
export default trusteeSlice.reducer;
