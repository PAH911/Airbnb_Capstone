import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/config";

// Fetch danh sách vị trí
export const fetchLocations = createAsyncThunk(
  "location/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/vi-tri");
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

    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken") || "";
    const tokenCybersoft = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjA1LzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1NzAzMDQwMDAwMCIsIm5iZiI6MTcyOTcyODAwMCwiZXhwIjoxNzU3MjAzMjAwfQ.8L6s48bhKNlI81VIJQ7GZJzwrZ2qGOzRK9OtGlTQ0VU";

    const res = await axiosInstance.post(`/vi-tri/upload-hinh-vitri?maViTri=${maViTri}`, formData, {
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
      console.log("=== Adding Location ===", location);
      console.log("=== Admin Token ===", localStorage.getItem("accessToken"));
      
      // 1. Tạo vị trí mới
      const res = await axiosInstance.post("/vi-tri", location);
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
