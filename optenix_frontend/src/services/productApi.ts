import api from "../api/axios";
import { Product } from "../types/Product";

/* ================= PUBLIC ================= */

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products"); // final → /api/products
  return res.data.products ?? res.data;
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/${id}`); // final → /api/products/:id
  return res.data.product ?? res.data;
};

/* ================= ADMIN ================= */

// Create product
export const createProduct = async (data: Partial<Product>) => {
  const res = await api.post("/products", data); // final → /api/products
  return res.data;
};

// Update product
export const updateProduct = async (
  id: string,
  data: Partial<Product>
) => {
  const res = await api.put(`/products/${id}`, data); // final → /api/products/:id
  return res.data;
};

// Delete product
export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`); // final → /api/products/:id
  return res.data;
};
