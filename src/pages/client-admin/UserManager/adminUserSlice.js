import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OCIsIkhldEhhblN0cmluZyI6IjIwLzA3LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Mjk2OTYwMDAwMCIsIm5iZiI6MTcyNjA3NDAwMCwiZXhwIjoxNzUzMTE3MjAwfQ.Qh5EKISAVqlhbNkgh1gtzDLUv1TXC7WpqNdNpAS2274";

export const fetchUserList = createAsyncThunk(
  "userList/fetchUserList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("https://airbnbnew.cybersoft.edu.vn/api/users", {
        headers: { TokenCybersoft: TOKEN },
      });
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể tải danh sách người dùng");
    }
  }
);

export const addUser = createAsyncThunk(
  "userList/addUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "https://airbnbnew.cybersoft.edu.vn/api/users",
        { ...user, phone: null },
        { headers: { TokenCybersoft: TOKEN } }
      );
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.content || "Thêm user thất bại");
    }
  }
);

export const updateUser = createAsyncThunk(
  "userList/updateUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `https://airbnbnew.cybersoft.edu.vn/api/users/${user.id}`,
        { ...user, phone: null },
        { headers: { TokenCybersoft: TOKEN } }
      );
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.content || "Cập nhật thất bại");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "userList/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`https://airbnbnew.cybersoft.edu.vn/api/users`, {
        headers: { TokenCybersoft: TOKEN },
        params: { id },
      });
      return id; // trả lại id để xóa khỏi store
    } catch (err) {
      return rejectWithValue(err.response?.data?.content || "Xoá thất bại");
    }
  }
);

const userListSlice = createSlice({
  name: "userList",
  initialState: {
    users: [],
    loading: false,
    error: null,
    addLoading: false,
    updateLoading: false,
    deleteLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUserList
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addLoading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export default userListSlice.reducer;
