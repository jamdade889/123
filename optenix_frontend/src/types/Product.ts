export interface Product {
  _id: string;

  name: string;
  image: string;
  images?: string[];

  price: number;
  originalPrice?: number;
  discount?: string;

  rating: number;
  description: string;

  specifications: { key: string; value: string }[];

  // NEW FIELDS
  category: string;
  subCategory?: string;
  featured?: boolean;

  isActive: boolean;
  status: "draft" | "published";

  createdAt: string;
  updatedAt: string;
}

/* ✅ ADD THIS */
export interface ProductForm {
  name: string;
  image: string;
  images: string[];

  price: number | "";
  originalPrice: number | "";

  rating: number | "";
  discount: string;

  description: string;

  specifications: { key: string; value: string }[];

  // NEW
  category: string;
  subCategory: string;
  featured: boolean;
}