import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as roomService from "../../../services/roomService";

export const fetchRoomDetail = createAsyncThunk(
  "roomDetail/fetchRoomDetail",
  async (roomId, { rejectWithValue }) => {
    try {
      const res = await roomService.getRoomById(roomId);
      return res.data.content;
    } catch (err) {
      return rejectWithValue("Không thể tải chi tiết phòng");
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: "",
};

const roomDetailSlice = createSlice({
  name: "roomDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomDetail.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRoomDetail.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoomDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default roomDetailSlice.reducer;
