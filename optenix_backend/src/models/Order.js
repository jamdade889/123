import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      email: String,
      mobile: String,
      billingAddress: String,
      shippingAddress: String,
    },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "PLACED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);