import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/config";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (body, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signin", body);
      console.log("=== API Response ===", res.data);
      return res.data;
    } catch (err) {
      console.error("=== API Error ===", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "adminlogin", // phải trùng với key trong store
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error khi bắt đầu login
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        console.log("=== Login Response in Slice ===", action.payload);
        state.loading = false;

        // Dựa trên API response từ Swagger:
        // {statusCode: 200, content: {user: {...}, token: "..."}, dateTime: "..."}
        const { content } = action.payload;

        if (content && content.user) {
          const user = content.user;
          const token = content.token;

          console.log("=== Extracted User ===", user);
          console.log("=== Extracted Token ===", token);

          // Kiểm tra role admin
          const userRole = user.role || user.Role || user.ROLE;
          if (userRole && userRole.toLowerCase() === "admin") {
            state.user = user;
            state.token = token;

            // Lưu vào localStorage
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            localStorage.setItem("accessToken", token);

            console.log("✅ Admin login successful, data saved");
          } else {
            state.error = "Bạn không có quyền truy cập admin!";
            console.log("❌ User is not admin:", userRole);
          }
        } else {
          state.error = "Invalid response format from server";
          console.log("❌ Invalid response format:", action.payload);
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;

        // Xử lý error message từ API
        let errorMessage = "Đăng nhập thất bại!";

        if (action.payload) {
          if (typeof action.payload === "string") {
            errorMessage = action.payload;
          } else if (action.payload.message) {
            errorMessage = action.payload.message;
          } else if (action.payload.content) {
            errorMessage = action.payload.content;
          }
        }

        state.error = errorMessage;
        console.error("=== Login Error ===", errorMessage);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
