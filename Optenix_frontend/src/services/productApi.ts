
// updated productApi.ts file
import api from "../api/axios";
import { Product } from "../types/Product";

/* ================= PUBLIC ================= */

// Get all products
// Calls backend → GET /api/products
export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/api/products");
  return res.data.products ?? res.data;
};

// Get product by ID
// Calls backend → GET /api/products/:id
export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/api/products/${id}`);
  return res.data.product ?? res.data;
};

/* ================= ADMIN ================= */

// Create product
//Calls → POST /api/products
export const createProduct = async (data: Partial<Product>) => {
  const res = await api.post("/products", data);
  return res.data;
};

// Update product
// Calls → PUT /api/products/:id
export const updateProduct = async (
  id: string,
  data: Partial<Product>
) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

// Delete product
// Calls → DELETE /api/products/:id
export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};