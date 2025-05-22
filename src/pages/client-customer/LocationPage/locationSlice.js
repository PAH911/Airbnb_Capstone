import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as locationService from "../../services/locationService";

export const fetchRoomsByLocation = createAsyncThunk(
  "location/fetchRoomsByLocation",
  async (locationId, thunkAPI) => {
    try {
      const res = await locationService.getRoomsByLocation(locationId);
      return res.data.content || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Không tải được danh sách phòng!");
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomsByLocation.fulfilled, (state, action) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoomsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
