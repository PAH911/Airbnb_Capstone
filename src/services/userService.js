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
// Đổi mật khẩu
export const changePassword = (data) =>
  axiosInstance.post("/users/change-password", data);
// Lấy thông tin user hiện tại
export const getCurrentUser = (token) =>
  axiosInstance.get("/users/getUser", {
    headers: { Authorization: `Bearer ${token}` },
  });
