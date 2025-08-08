import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/config";

export const fetchUserList = createAsyncThunk(
  "userList/fetchUserList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/users");
      console.log("=== Fetch Users Response ===", res.data);
      return res.data.content;
    } catch (err) {
      console.error("=== Fetch Users Error ===", err.response?.data);
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "userList/addUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users", { ...user, phone: null });
      console.log("=== Add User Response ===", res.data);
      return res.data.content;
    } catch (err) {
      console.error("=== Add User Error ===", err.response?.data);
      return rejectWithValue(
        err.response?.data?.content || "Thêm user thất bại"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "userList/updateUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/users/${user.id}`, {
        ...user,
        phone: null,
      });
      console.log("=== Update User Response ===", res.data);
      return res.data.content;
    } catch (err) {
      console.error("=== Update User Error ===", err.response?.data);
      return rejectWithValue(
        err.response?.data?.content || "Cập nhật thất bại"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "userList/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/users`, { params: { id } });
      console.log("=== Delete User Response ===", res.data);
      return id; // trả lại id để xóa khỏi store
    } catch (err) {
      console.error("=== Delete User Error ===", err.response?.data);
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
        state.users = Array.isArray(action.payload) ? action.payload : [];
        console.log("=== Users loaded ===", state.users.length, "users");
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = []; // Đảm bảo users luôn là array
        console.error("=== Fetch users failed ===", action.payload);
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addLoading = false;
        if (action.payload && Array.isArray(state.users)) {
          state.users.push(action.payload);
        }
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
        if (action.payload && Array.isArray(state.users)) {
          const index = state.users.findIndex(
            (u) => u.id === action.payload.id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
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
        if (Array.isArray(state.users)) {
          state.users = state.users.filter((u) => u.id !== action.payload);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export default userListSlice.reducer;
