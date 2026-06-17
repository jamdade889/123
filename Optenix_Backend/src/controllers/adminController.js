import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Only fetch totalAmount field (performance optimization)
    const orders = await Order.find().select("totalAmount");

    const totalRevenue = orders.reduce(
      (acc, order) => acc + (order.totalAmount || 0),
      0
    );

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};