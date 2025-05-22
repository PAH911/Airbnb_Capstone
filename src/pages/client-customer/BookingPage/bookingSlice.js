import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../../../services/bookingService";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (data, { rejectWithValue }) => {
    try {
      const res = await bookingService.createBooking(data);
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Đặt phòng thất bại"
      );
    }
  }
);

const initialState = {
  booking: null,
  loading: false,
  error: "",
  success: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBooking: (state) => {
      state.booking = null;
      state.loading = false;
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.booking = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
