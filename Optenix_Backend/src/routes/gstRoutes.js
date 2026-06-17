import express from "express";
import { verifyGST } from "../controllers/gstController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GST Verify Route
router.post("/verify", authMiddleware, verifyGST);

export default router;