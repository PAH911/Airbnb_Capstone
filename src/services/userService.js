import axiosInstance from "../api/config";

// Lấy danh sách người dùng
export const getUsers = () => axiosInstance.get("/users");
// Lấy thông tin người dùng theo id
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
// Cập nhật thông tin người dùng
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
// Xóa người dùng
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
// Đăng ký
export const register = (data) => axiosInstance.post("/auth/signup", data);
// Lấy thông tin user hiện tại
export const getCurrentUser = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No accessToken found");

  const payload = JSON.parse(atob(token.split(".")[1]));
  return getUserById(payload.id); // dùng hàm có sẵn
};
// Upload avatar user
export const uploadUserAvatar = (formData) => {
  return axiosInstance.post(`/users/upload-avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
