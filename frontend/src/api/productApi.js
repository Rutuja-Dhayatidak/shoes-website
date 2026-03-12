import API from "./axiosInstance";

// ✅ Create Product (Vendor)
export const createProduct = (data) => {
    return API.post("/shoes/create", data);
};

// ✅ Get All Products
export const getProducts = (params) => {
    return API.get("/shoes", { params });
};

// ✅ Get Single Product
export const getSingleProduct = (id) => {
    return API.get(`/shoes/${id}`);
};

// ✅ Update Product
export const updateProduct = (id, data) => {
    return API.put(`/shoes/${id}`, data);
};

// ✅ Delete Product
export const deleteProduct = (id) => {
    return API.delete(`/shoes/${id}`);
};

// ✅ Get Distinct Shoe Types for a Category
export const getShoeTypes = (category) => {
    return API.get('/shoes/types', { params: { category } });
};

// ✅ Get Distinct Shoe Brands for a Category
export const getShoeBrands = (category) => {
    return API.get('/shoes/brands', { params: { category } });
};
