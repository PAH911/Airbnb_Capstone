import axiosInstance from "../api/config";

// Lấy danh sách bình luận
export const getComments = () => axiosInstance.get("/binh-luan");
// Lấy bình luận theo phòng
export const getCommentsByRoom = (roomId) =>
  axiosInstance.get(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
// Thêm bình luận
export const createComment = (data) => axiosInstance.post("/binh-luan", data);
// Xóa bình luận
export const deleteComment = (id) => axiosInstance.delete(`/binh-luan/${id}`);
// Sửa bình luận
export const updateComment = (id, data) =>
  axiosInstance.put(`/binh-luan/${id}`, data);
