import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../../../services/bookingService";

// Async thunk để fetch tất cả bookings
export const fetchBookings = createAsyncThunk(
  "adminBooking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookings();
      return response.data.content || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải danh sách đặt phòng"
      );
    }
  }
);

// Async thunk để xóa booking
export const deleteBooking = createAsyncThunk(
  "adminBooking/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      await bookingService.deleteBooking(bookingId);
      return bookingId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể xóa đặt phòng"
      );
    }
  }
);

// Async thunk để cập nhật booking
export const updateBooking = createAsyncThunk(
  "adminBooking/updateBooking",
  async ({ bookingId, bookingData }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBooking(
        bookingId,
        bookingData
      );
      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể cập nhật đặt phòng"
      );
    }
  }
);

const adminBookingSlice = createSlice({
  name: "adminBooking",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    totalBookings: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.totalBookings = action.payload.length;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.totalBookings = action.payload.length;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
        state.totalBookings = state.bookings.length;
        state.error = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setBookings } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;
