import express from "express";
import { createOrder } from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);

export default router;