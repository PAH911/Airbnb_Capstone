import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as commentService from "../../../services/commentService";

export const fetchCommentsByRoom = createAsyncThunk(
  "comment/fetchCommentsByRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      const res = await commentService.getCommentsByRoom(roomId);
      return res.data.content;
    } catch (err) {
      return rejectWithValue("Không thể tải bình luận");
    }
  }
);

export const postComment = createAsyncThunk(
  "comment/postComment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await commentService.createComment(payload);
      return res.data.content;
    } catch (err) {
      return rejectWithValue("Không thể gửi bình luận");
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: "",
  posting: false,
  postError: "",
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByRoom.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCommentsByRoom.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchCommentsByRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      })
      .addCase(postComment.pending, (state) => {
        state.posting = true;
        state.postError = "";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.posting = false;
      })
      .addCase(postComment.rejected, (state, action) => {
        state.posting = false;
        state.postError = action.payload || "Lỗi không xác định";
      });
  },
});

export default commentSlice.reducer;
