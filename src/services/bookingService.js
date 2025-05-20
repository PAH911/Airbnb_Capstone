import axiosInstance from "../api/config";

// Lấy danh sách đặt phòng
export const getBookings = () => axiosInstance.get("/dat-phong");
// Lấy chi tiết đặt phòng
export const getBookingById = (id) => axiosInstance.get(`/dat-phong/${id}`);
// Đặt phòng mới
export const createBooking = (data) => axiosInstance.post("/dat-phong", data);
// Cập nhật đặt phòng
export const updateBooking = (id, data) =>
  axiosInstance.put(`/dat-phong/${id}`, data);
// Xóa đặt phòng
export const deleteBooking = (id) => axiosInstance.delete(`/dat-phong/${id}`);
// Lấy đặt phòng theo user
export const getBookingsByUser = (userId) =>
  axiosInstance.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
