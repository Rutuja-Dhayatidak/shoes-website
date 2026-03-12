import axiosInstance from "../api/axiosInstance";

export const addAddress = async (addressData) => {
  const response = await axiosInstance.post("/address/add", addressData);
  return response.data;
};

export const getAddresses = async () => {
  const response = await axiosInstance.get("/address");
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await axiosInstance.delete(`/address/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/orders/create", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get("/orders/my-orders");
  return response.data;
};

export const createRazorpayOrder = async (amount) => {
  const response = await axiosInstance.post("/payment/create-order", { amount });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axiosInstance.post("/payment/verify", paymentData);
  return response.data;
};
