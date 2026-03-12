import axiosInstance from "./axiosInstance";

// 👤 User request to become vendor
export const requestVendor = async () => {
    const response = await axiosInstance.post("/vendor/request");
    return response.data;
};

// 👑 Admin view vendor requests
export const getVendorRequests = async () => {
    const response = await axiosInstance.get("/vendor/requests");
    return response.data;
};

// 👑 Admin approve vendor
export const approveVendor = async (id) => {
    const response = await axiosInstance.put(`/vendor/approve/${id}`);
    return response.data;
};

// 👟 Vendor get only his products
export const getMyProducts = async (page = 1, limit = 5) => {
    const response = await axiosInstance.get(`/vendor/my-products?page=${page}&limit=${limit}`);
    return response.data;
};

// 📊 Vendor dashboard
export const getVendorDashboard = async () => {
    const response = await axiosInstance.get("/vendor/dashboard");
    return response.data;
};

// 🔄 Update Stock
export const updateStock = async (id, sizes) => {
    const response = await axiosInstance.put(
        `/vendor/update-stock/${id}`,
        { sizes }
    );
    return response.data;
};

// 📊 Vendor orders
export const getVendorOrders = async () => {
    const response = await axiosInstance.get("/orders/vendor-orders");
    return response.data;
};

// 📊 Vendor dashboard stats
export const getVendorDashboardStats = async () => {
    const response = await axiosInstance.get("/vendor/orders-manage/dashboard/stats");
    return response.data;
};

// 🔄 Update Order Status
export const updateVendorOrderStatus = async (orderId, status, message = "") => {
    const response = await axiosInstance.patch(`/vendor/orders-manage/orders/${orderId}/status`, { status, message });
    return response.data;
};

// 💰 Update Payment Status (COD)
export const updateVendorPaymentStatus = async (orderId) => {
    const response = await axiosInstance.patch(`/vendor/orders-manage/orders/${orderId}/payment`);
    return response.data;
};

// 📄 Get Vendor Order Details
export const getVendorOrderDetails = async (orderId) => {
    const response = await axiosInstance.get(`/vendor/orders-manage/orders/${orderId}`);
    return response.data;
};

// 🗑 Delete Product
export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(
        `/vendor/delete-product/${id}`
    );
    return response.data;
};