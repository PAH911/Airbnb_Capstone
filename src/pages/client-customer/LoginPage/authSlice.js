import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../../services/authService";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      // Lưu accessToken
      localStorage.setItem("accessToken", response.data.content.token);
      // Lưu user vào localStorage cho các trang khác đọc được
      localStorage.setItem(
        "userInfo",
        JSON.stringify(response.data.content.user)
      );
      return {
        user: response.data.content.user,
        token: response.data.content.token,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.content ||
          error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại!"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo"); // Xóa luôn userInfo
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
