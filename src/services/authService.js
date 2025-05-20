import axiosInstance from "../api/config";

export const login = (credentials) => {
  return axiosInstance.post("/auth/signin", credentials);
};

export const register = (data) => {
  // Đảm bảo đúng định dạng API yêu cầu
  const payload = {
    ...data,
    gender:
      data.gender === true ||
      data.gender === "true" ||
      data.gender === 1 ||
      data.gender === "1",
    role: "USER", // API yêu cầu role, mặc định là USER
  };
  // Xóa trường confirm nếu có
  delete payload.confirm;
  return axiosInstance.post("/auth/signup", payload);
};
