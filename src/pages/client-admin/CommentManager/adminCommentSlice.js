import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/config";

// Fetch danh sách bình luận
export const fetchComments = createAsyncThunk(
  "adminComment/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/binh-luan");
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Không tải được danh sách bình luận"
      );
    }
  }
);

// Fetch bình luận theo phòng
export const fetchCommentsByRoom = createAsyncThunk(
  "adminComment/fetchCommentsByRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/binh-luan/lay-binh-luan-theo-phong/${roomId}`
      );
      return res.data.content;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Không tải được bình luận theo phòng"
      );
    }
  }
);

// Thêm bình luận mới
export const addComment = createAsyncThunk(
  "adminComment/addComment",
  async (commentData, { rejectWithValue }) => {
    try {
      console.log("=== Adding Comment ===", commentData);
      const res = await axiosInstance.post("/binh-luan", commentData);
      return res.data.content;
    } catch (err) {
      console.error("Add comment error:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Thêm bình luận thất bại"
      );
    }
  }
);

// Cập nhật bình luận
export const updateComment = createAsyncThunk(
  "adminComment/updateComment",
  async ({ id, commentData }, { rejectWithValue }) => {
    try {
      console.log("=== Updating Comment ===", { id, commentData });
      const res = await axiosInstance.put(`/binh-luan/${id}`, commentData);
      return res.data.content;
    } catch (err) {
      console.error("Update comment error:", err);
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Cập nhật bình luận thất bại"
      );
    }
  }
);

// Xóa bình luận
export const deleteComment = createAsyncThunk(
  "adminComment/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      console.log("=== Deleting Comment ===", id);
      await axiosInstance.delete(`/binh-luan/${id}`);
      return id;
    } catch (err) {
      console.error("Delete comment error:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Xóa bình luận thất bại"
      );
    }
  }
);

const adminCommentSlice = createSlice({
  name: "adminComment",
  initialState: {
    comments: [],
    loading: false,
    error: null,
    addLoading: false,
    addError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null,
    searchKeyword: "",
    sortBy: "newest", // newest, oldest
    filterByRoom: "",
  },
  reducers: {
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setFilterByRoom: (state, action) => {
      state.filterByRoom = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.addError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch comments by room
      .addCase(fetchCommentsByRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add comment
      .addCase(addComment.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.addLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload;
      })
      // update comment
      .addCase(updateComment.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // delete comment
      .addCase(deleteComment.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { setSearchKeyword, setSortBy, setFilterByRoom, clearError } =
  adminCommentSlice.actions;

export default adminCommentSlice.reducer;
