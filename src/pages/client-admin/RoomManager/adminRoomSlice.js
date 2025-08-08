import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/config";

// Fetch danh sách phòng
export const fetchRooms = createAsyncThunk(
  "adminRoom/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/phong-thue");
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Không tải được danh sách phòng"
      );
    }
  }
);

// Fetch phòng theo vị trí
export const fetchRoomsByLocation = createAsyncThunk(
  "adminRoom/fetchRoomsByLocation",
  async (locationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`
      );
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Không tải được phòng theo vị trí"
      );
    }
  }
);

// Fetch phần trang tìm kiếm
export const searchRooms = createAsyncThunk(
  "adminRoom/searchRooms",
  async (
    { pageIndex = 1, pageSize = 10, keyword = "" },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(
        `/phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
      );
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Tìm kiếm thất bại"
      );
    }
  }
);

// Fetch chi tiết phòng
export const fetchRoomDetail = createAsyncThunk(
  "adminRoom/fetchRoomDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/phong-thue/${id}`);
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Không tải được chi tiết phòng"
      );
    }
  }
);

// Upload ảnh phòng
export async function uploadRoomImage(roomId, file) {
  try {
    const formData = new FormData();
    formData.append("formFile", file);

    const token = localStorage.getItem("accessToken") || "";
    const tokenCybersoft =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjA1LzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1NzAzMDQwMDAwMCIsIm5iZiI6MTcyOTcyODAwMCwiZXhwIjoxNzU3MjAzMjAwfQ.8L6s48bhKNlI81VIJQ7GZJzwrZ2qGOzRK9OtGlTQ0VU";

    const res = await axiosInstance.post(
      `/phong-thue/upload-hinh-phong?maPhong=${roomId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          tokenCybersoft: tokenCybersoft,
          token: token,
        },
      }
    );

    return res.data.content;
  } catch (error) {
    console.error("Upload ảnh phòng thất bại", error);
    throw error;
  }
}

// Thêm phòng mới
export const addRoom = createAsyncThunk(
  "adminRoom/addRoom",
  async ({ room, imageFile }, { rejectWithValue }) => {
    try {
      console.log("=== Adding Room ===", room);

      // 1. Tạo phòng mới
      const res = await axiosInstance.post("/phong-thue", room);
      const newRoom = res.data.content;

      // 2. Nếu có ảnh, upload ảnh sau
      if (imageFile) {
        try {
          await uploadRoomImage(newRoom.id, imageFile);
          console.log("=== Image Upload Success ===");
        } catch (imgError) {
          console.error("=== Image Upload Failed ===", imgError);
          // Trả về thông báo lỗi cụ thể về upload ảnh
          return rejectWithValue(
            `Tạo phòng thành công nhưng upload hình ảnh thất bại: ${
              imgError.response?.data?.message ||
              imgError.message ||
              "Lỗi upload ảnh"
            }`
          );
        }
      }

      return newRoom;
    } catch (err) {
      console.error("Add room error:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Thêm phòng thất bại"
      );
    }
  }
);

// Cập nhật phòng
export const updateRoom = createAsyncThunk(
  "adminRoom/updateRoom",
  async ({ id, room, imageFile }, { rejectWithValue }) => {
    try {
      console.log("=== Updating Room ===", { id, room });

      // 1. Cập nhật thông tin phòng
      const res = await axiosInstance.put(`/phong-thue/${id}`, room);
      const updatedRoom = res.data.content;

      // 2. Nếu có ảnh mới, upload ảnh
      if (imageFile) {
        try {
          await uploadRoomImage(id, imageFile);
          console.log("=== Image Upload Success ===");
        } catch (imgError) {
          console.error("=== Image Upload Failed ===", imgError);
          // Trả về thông báo lỗi cụ thể về upload ảnh
          return rejectWithValue(
            `Cập nhật thông tin phòng thành công nhưng upload hình ảnh thất bại: ${
              imgError.response?.data?.message ||
              imgError.message ||
              "Lỗi upload ảnh"
            }`
          );
        }
      }

      return updatedRoom;
    } catch (err) {
      console.error("Update room error:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Cập nhật phòng thất bại"
      );
    }
  }
);

// Xóa phòng
export const deleteRoom = createAsyncThunk(
  "adminRoom/deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      console.log("=== Deleting Room ===", id);

      await axiosInstance.delete(`/phong-thue/${id}`);

      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa phòng thất bại"
      );
    }
  }
);

const adminRoomSlice = createSlice({
  name: "adminRoom",
  initialState: {
    rooms: [],
    roomDetail: null,
    loading: false,
    error: null,
    addLoading: false,
    addError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null,
    searchLoading: false,
    searchError: null,
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      totalRow: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.addError = null;
      state.updateError = null;
      state.deleteError = null;
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // search rooms
      .addCase(searchRooms.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchRooms.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.rooms = action.payload.data;
        state.pagination = {
          pageIndex: action.payload.pageIndex,
          pageSize: action.payload.pageSize,
          totalRow: action.payload.totalRow,
        };
      })
      .addCase(searchRooms.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })
      // fetch room detail
      .addCase(fetchRoomDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoomDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.roomDetail = action.payload;
      })
      .addCase(fetchRoomDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add room
      .addCase(addRoom.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.addLoading = false;
        state.rooms.push(action.payload);
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload;
      })
      // update room
      .addCase(updateRoom.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.rooms.findIndex(
          (room) => room.id === action.payload.id
        );
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // delete room
      .addCase(deleteRoom.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { clearError } = adminRoomSlice.actions;
export default adminRoomSlice.reducer;
