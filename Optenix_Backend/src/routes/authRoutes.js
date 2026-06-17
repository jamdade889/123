import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  sendOtp,
  verifyOtp,
   changePassword,
} from "../controllers/authController.js";
import  authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// User auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Email OTP
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

// Get logged-in user
router.get("/me", authMiddleware, getMe);

router.put(
  "/change-password",
  authMiddleware(),
  changePassword
);

export default router;