import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= PUBLIC SHOP ================= */
router.get("/", getProducts);
router.get("/:id", getProductById);

/* ================= ADMIN ONLY ================= */
router.post("/", authMiddleware(["admin"]), addProduct);
router.put("/:id", authMiddleware(["admin"]), updateProduct);
router.delete("/:id", authMiddleware(["admin"]), deleteProduct);
//router.post("/all",authMiddleware(["admin"],deleteAllProducts))

router.post("/all", authMiddleware(["admin"]), deleteAllProducts);

export default router;