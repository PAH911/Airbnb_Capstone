import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as locationService from "@/services/locationService";
import * as roomService from "@/services/roomService";

// Async thunk để fetch location và rooms
export const fetchRoomListData = createAsyncThunk(
  "roomList/fetchRoomListData",
  async (_, { rejectWithValue }) => {
    try {
      const locRes = await locationService.getLocations();
      const locations = locRes.data.content || [];

      const roomRes = await roomService.getRooms();
      const rooms = roomRes.data.content || [];

      // Nhóm phòng theo location
      const grouped = {};
      locations.forEach((loc) => {
        grouped[loc.id] = rooms.filter((r) => r.maViTri === loc.id);
      });

      return { locations, rooms, roomsByLocation: grouped };
    } catch (err) {
      return rejectWithValue("Không thể tải dữ liệu phòng hoặc vị trí");
    }
  }
);

const roomListSlice = createSlice({
  name: "roomList",
  initialState: {
    locations: [],
    rooms: [],
    roomsByLocation: {},
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomListData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchRoomListData.fulfilled, (state, action) => {
        state.locations = action.payload.locations;
        state.rooms = action.payload.rooms;
        state.roomsByLocation = action.payload.roomsByLocation;
        state.loading = false;
      })
      .addCase(fetchRoomListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export default roomListSlice.reducer;
