import axiosInstance from "../api/config";

// Lấy danh sách vị trí
export const getLocations = () => axiosInstance.get("/vi-tri");
// Lấy chi tiết vị trí
export const getLocationById = (id) => axiosInstance.get(`/vi-tri/${id}`);
// Thêm vị trí mới (admin)
export const createLocation = (data) => axiosInstance.post("/vi-tri", data);
// Cập nhật vị trí (admin)
export const updateLocation = (id, data) =>
  axiosInstance.put(`/vi-tri/${id}`, data);
// Xóa vị trí (admin)
export const deleteLocation = (id) => axiosInstance.delete(`/vi-tri/${id}`);
// Lấy phòng theo vị trí
export const getRoomsByLocation = (locationId) =>
  axiosInstance.get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
