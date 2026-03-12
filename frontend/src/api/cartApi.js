import axiosInstance from "./axiosInstance";

export const getCart = async () => {
    const response = await axiosInstance.get("/cart");
    return response.data;
};

export const addToCart = async (productData) => {
    const response = await axiosInstance.post("/cart/add", productData);
    return response.data;
};

export const increaseQuantity = async (productId, selectedSize) => {
    const response = await axiosInstance.patch(`/cart/increase/${productId}`, { selectedSize });
    return response.data;
};

export const decreaseQuantity = async (productId, selectedSize) => {
    const response = await axiosInstance.patch(`/cart/decrease/${productId}`, { selectedSize });
    return response.data;
};

export const removeFromCart = async (productId, selectedSize) => {
    const response = await axiosInstance.delete(`/cart/remove/${productId}`, { data: { selectedSize } });
    return response.data;
};

export const clearCart = async () => {
    const response = await axiosInstance.delete("/cart/clear");
    return response.data;
};
