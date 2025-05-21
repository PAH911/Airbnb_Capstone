import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (body, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signin", body);
      return res.data; // giả sử trả về {content: {user, token}}
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "adminlogin", // phải trùng với key trong store
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        const user = action.payload.content?.user || action.payload.user;
        const token = action.payload.content?.token || action.payload.token;
        state.user = user;
        state.token = token;
        state.loading = false; // <- PHẢI CÓ DÒNG NÀY!
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false; // <- PHẢI CÓ DÒNG NÀY!
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
