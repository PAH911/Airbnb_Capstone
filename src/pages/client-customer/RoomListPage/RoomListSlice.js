import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as locationService from "../../../services/locationService";
import * as roomService from "../../../services/roomService";
import * as commentService from "../../../services/commentService";

// Async thunk để fetch location, rooms và comments
export const fetchRoomListData = createAsyncThunk(
  "roomList/fetchRoomListData",
  async (_, { rejectWithValue }) => {
    try {
      const locRes = await locationService.getLocations();
      const locations = locRes.data.content || [];

      const roomRes = await roomService.getRooms();
      const rooms = roomRes.data.content || [];

      // Fetch tất cả comments
      const commentsRes = await commentService.getComments();
      const allComments = commentsRes.data.content || [];

      // Tính toán số sao trung bình cho mỗi phòng dựa trên comments
      const roomsWithRating = rooms.map((room) => {
        const roomComments = allComments.filter(
          (comment) => comment.maPhong === room.id
        );
        let averageRating = null; // Không có rating mặc định

        if (roomComments.length > 0) {
          const totalRating = roomComments.reduce((sum, comment) => {
            return sum + (comment.saoBinhLuan || 5);
          }, 0);
          averageRating = Number(
            (totalRating / roomComments.length).toFixed(1)
          );
        }

        // Debug log cho phòng đầu tiên
        if (room === rooms[0]) {
          console.log("=== Room Rating Calculation ===", {
            roomId: room.id,
            roomName: room.tenPhong,
            commentsCount: roomComments.length,
            commentsData: roomComments.map((c) => ({
              id: c.id,
              rating: c.saoBinhLuan,
            })),
            calculatedRating: averageRating,
          });
        }

        return {
          ...room,
          averageRating: averageRating,
          totalComments: roomComments.length,
        };
      });

      // Nhóm phòng theo location
      const grouped = {};
      locations.forEach((loc) => {
        grouped[loc.id] = roomsWithRating.filter((r) => r.maViTri === loc.id);
      });

      return { locations, rooms: roomsWithRating, roomsByLocation: grouped };
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
    filteredRoomsByLocation: {},
    filters: {
      priceRange: [0, 10000000],
      location: null,
      rating: 0,
      guests: 1,
    },
    loading: false,
    error: "",
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      // Apply filters
      const filtered = {};
      Object.keys(state.roomsByLocation).forEach((locationId) => {
        filtered[locationId] = state.roomsByLocation[locationId].filter(
          (room) => {
            // Filter by price
            const priceMatch =
              room.giaTien >= action.payload.priceRange[0] &&
              room.giaTien <= action.payload.priceRange[1];

            // Filter by location
            const locationMatch =
              !action.payload.location ||
              room.maViTri === action.payload.location;

            // Filter by rating
            const ratingMatch =
              !action.payload.rating ||
              (room.averageRating !== null &&
                room.averageRating >= action.payload.rating);

            // Filter by guests (assuming khach field exists)
            const guestsMatch =
              !room.khach || room.khach >= action.payload.guests;

            return priceMatch && locationMatch && ratingMatch && guestsMatch;
          }
        );
      });
      state.filteredRoomsByLocation = filtered;
    },
    clearFilters: (state) => {
      state.filters = {
        priceRange: [0, 10000000],
        location: null,
        rating: 0,
        guests: 1,
      };
      state.filteredRoomsByLocation = { ...state.roomsByLocation };
    },
  },
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
        state.filteredRoomsByLocation = action.payload.roomsByLocation;
        state.loading = false;
      })
      .addCase(fetchRoomListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export const { setFilters, clearFilters } = roomListSlice.actions;
export default roomListSlice.reducer;
