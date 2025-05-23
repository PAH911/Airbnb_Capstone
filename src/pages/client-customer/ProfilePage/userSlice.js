// src/pages/client-customer/ProfilePage/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserById,
  updateUser,
  uploadUserAvatar as uploadUserAvatarService,
} from "@/services/userService";

// Fetch user info by id
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getUserById(id);
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi fetch user");
    }
  }
);

// Update user info
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await updateUser(id, data);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi update user");
    }
  }
);

// Upload avatar
export const uploadAvatarThunk = createAsyncThunk(
  "user/uploadAvatar",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await uploadUserAvatarService(formData);
      return res.data.content.avatar; // Trả về link avatar mới
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi upload avatar"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // updateUserInfo
      .addCase(updateUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.status = "succeeded";
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // uploadAvatar
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        state.user.avatar = action.payload;
      })
      .addCase(uploadAvatarThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
