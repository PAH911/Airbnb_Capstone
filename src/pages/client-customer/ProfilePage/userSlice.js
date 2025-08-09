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
  async ({ formData, userId }, { rejectWithValue, dispatch }) => {
    try {
      const res = await uploadUserAvatarService(formData);
      console.log("Upload avatar response:", res.data);
      
      // Fetch lại thông tin user mới nhất sau khi upload
      const userRes = await dispatch(fetchUser(userId)).unwrap();
      
      // Cập nhật localStorage
      localStorage.setItem("userInfo", JSON.stringify(userRes));
      
      return userRes;
    } catch (err) {
      console.error("Upload avatar error:", err);
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data?.content || 
        err.message || 
        "Lỗi upload avatar"
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
        state.user = action.payload;
      })
      .addCase(uploadAvatarThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
