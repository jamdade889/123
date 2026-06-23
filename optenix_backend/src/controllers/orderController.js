import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
};