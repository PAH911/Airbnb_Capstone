import axiosInstance from "../api/config";

// Lấy danh sách phòng
export const getRooms = () => axiosInstance.get("/phong-thue");
// Lấy chi tiết phòng
export const getRoomById = (id) => axiosInstance.get(`/phong-thue/${id}`);
// Thêm phòng mới (admin)
export const createRoom = (data) => axiosInstance.post("/phong-thue", data);
// Cập nhật phòng (admin)
export const updateRoom = (id, data) =>
  axiosInstance.put(`/phong-thue/${id}`, data);
// Xóa phòng (admin)
export const deleteRoom = (id) => axiosInstance.delete(`/phong-thue/${id}`);
// Lấy phòng theo vị trí
export const getRoomsByLocation = (locationId) =>
  axiosInstance.get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
