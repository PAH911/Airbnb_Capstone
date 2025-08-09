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

      // Tối ưu: Tạo Map để group comments theo room ID một lần
      const commentsByRoom = new Map();
      const roomRatingCache = new Map();

      allComments.forEach((comment) => {
        const roomId = comment.maPhong;
        if (!commentsByRoom.has(roomId)) {
          commentsByRoom.set(roomId, []);
        }
        commentsByRoom.get(roomId).push(comment);
      });

      // Tính toán rating một lần cho tất cả phòng có comments
      commentsByRoom.forEach((comments, roomId) => {
        const totalRating = comments.reduce((sum, comment) => {
          return sum + (comment.saoBinhLuan || 5);
        }, 0);
        const averageRating = Number(
          (totalRating / comments.length).toFixed(1)
        );

        roomRatingCache.set(roomId, {
          averageRating,
          totalComments: comments.length,
        });
      });

      // Áp dụng rating đã tính cho các phòng
      const roomsWithRating = rooms.map((room) => {
        const ratingData = roomRatingCache.get(room.id);

        return {
          ...room,
          averageRating: ratingData?.averageRating || null,
          totalComments: ratingData?.totalComments || 0,
        };
      });

      // Nhóm phòng theo location một cách hiệu quả
      const grouped = {};

      // Khởi tạo object với tất cả location IDs
      locations.forEach((loc) => {
        grouped[loc.id] = [];
      });

      // Group rooms một lần duy nhất
      roomsWithRating.forEach((room) => {
        if (grouped[room.maViTri]) {
          grouped[room.maViTri].push(room);
        }
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
      const newFilters = action.payload;

      // Kiểm tra xem có filter nào thay đổi không
      const filtersChanged =
        JSON.stringify(state.filters) !== JSON.stringify(newFilters);

      state.filters = newFilters;

      // Chỉ apply filter khi có thay đổi
      if (filtersChanged) {
        const filtered = {};

        // Sử dụng Object.entries để tối ưu hóa loop
        Object.entries(state.roomsByLocation).forEach(([locationId, rooms]) => {
          filtered[locationId] = rooms.filter((room) => {
            // Tối ưu: Kiểm tra điều kiện đơn giản trước
            if (newFilters.location && room.maViTri !== newFilters.location) {
              return false;
            }

            if (room.khach && room.khach < newFilters.guests) {
              return false;
            }

            if (
              room.giaTien < newFilters.priceRange[0] ||
              room.giaTien > newFilters.priceRange[1]
            ) {
              return false;
            }

            if (
              newFilters.rating > 0 &&
              (room.averageRating === null ||
                room.averageRating < newFilters.rating)
            ) {
              return false;
            }

            return true;
          });
        });

        state.filteredRoomsByLocation = filtered;
      }
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
