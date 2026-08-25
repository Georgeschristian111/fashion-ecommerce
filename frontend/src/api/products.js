import api from "./axios";

export const productsApi = {
  // params : { category, productType, sort, search, featured, page, limit }
  getProducts: (params = {}) => api.get("/products", { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
};
