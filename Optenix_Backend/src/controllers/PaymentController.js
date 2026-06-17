import crypto from "crypto";

/*
  These values will be given by BOB:
  MERCHANT_ID
  TERMINAL_ID
  SECRET_KEY
  PAYMENT_URL (UAT or Production)
*/

const MERCHANT_ID = process.env.BOB_MERCHANT_ID;
const TERMINAL_ID = process.env.BOB_TERMINAL_ID;
const SECRET_KEY = process.env.BOB_SECRET_KEY;
const PAYMENT_URL = process.env.BOB_PAYMENT_URL;

// CREATE PAYMENT REQUEST
export const createOrder = async (req, res) => {
  try {
    const { amount, customer } = req.body;

    const orderId = "ORD_" + Date.now();

    const payload = {
      merchantId: MERCHANT_ID,
      terminalId: TERMINAL_ID,
      orderId: orderId,
      amount: amount,
      currency: "INR",
      returnUrl: "http://localhost:3000/payment-success",
      customerEmail: customer.email,
    };

    // Convert to string
    const dataString = JSON.stringify(payload);

    // Generate signature
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(dataString)
      .digest("hex");

    res.json({
      paymentUrl: PAYMENT_URL,
      payload,
      signature,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};