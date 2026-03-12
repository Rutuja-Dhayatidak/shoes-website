import axiosInstance from "./axiosInstance";

// 👑 Dashboard Stats
export const getAdminStats = async () => {
  const response = await axiosInstance.get("/admin/stats");
  return response.data;
};

// 👥 Get All Users (Pagination)
export const getAllUsers = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(
    `/admin/users?page=${page}&limit=${limit}`
  );
  return response.data;
};

// 🗑 Delete User
export const deleteUserByAdmin = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

// 👟 Get All Shoes (Products)
export const getAllProducts = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get(
    `/admin/products?page=${page}&limit=${limit}`
  );
  return response.data;
};