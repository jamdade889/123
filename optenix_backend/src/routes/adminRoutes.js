import express from "express";
import User from "../models/User.js";
import { getDashboardStats } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET ALL USERS (ADMIN ONLY)
 * GET /api/admin/users
 */
router.get(
  "/users",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json(users);
    } catch (error) {
      console.error("Fetch users error:", error.message);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

/**
 * GET DASHBOARD STATS (ADMIN ONLY)
 * GET /api/admin/dashboard
 */
router.get(
  "/dashboard",
  authMiddleware(["admin"]),
  getDashboardStats
);

export default router;