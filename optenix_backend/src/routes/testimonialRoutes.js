import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTestimonial,
  getTestimonials,
  deleteTestimonial
} from "../controllers/testimonialController.js";

const router = express.Router();

// Public route
router.get("/", getTestimonials);

// Admin only
router.post("/", authMiddleware(["admin"]), createTestimonial);
router.delete("/:id", authMiddleware(["admin"]), deleteTestimonial);

export default router;