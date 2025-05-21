import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Fetch danh sách vị trí
export const fetchLocations = createAsyncThunk(
  "location/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/vi-tri");
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không tải được danh sách vị trí");
    }
  }
);

// Upload ảnh vị trí
export async function uploadLocationImage(maViTri, file) {
  try {
    const formData = new FormData();
    formData.append("formFile", file);

    // Lấy 2 token từ localStorage hoặc chỗ bạn lưu trữ token
    const token = localStorage.getItem("token") || ""; // token người dùng (bearer)
    const tokenCybersoft =
      localStorage.getItem("tokenCybersoft") ||
      "token_cybersoft_cố_định"; // token Cybersoft cố định (nếu có)

      const res = await api.post(`/vi-tri/upload-hinh-vitri?maViTri=${maViTri}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          tokenCybersoft: tokenCybersoft,
          token: token,
        }        
      });
      

    return res.data.content;
  } catch (error) {
    console.error("Upload ảnh vị trí thất bại", error);
    throw error;
  }
}


// Thêm vị trí mới
export const addLocation = createAsyncThunk(
  "location/addLocation",
  async ({ location, imageFile }, { rejectWithValue }) => {
    try {
      // 1. Tạo vị trí mới
      const res = await api.post("/vi-tri", location);
      const newLocation = res.data.content;

      // 2. Nếu có ảnh, upload ảnh sau
      if (imageFile) {
        await uploadLocationImage(newLocation.id, imageFile);
      }

      // Trả về vị trí mới
      return newLocation;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Thêm vị trí thất bại");
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    loading: false,
    error: null,
    addLoading: false,
    addError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add
      .addCase(addLocation.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.addLoading = false;
        state.locations.push(action.payload);
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload;
      });
  },
});

export default locationSlice.reducer;
