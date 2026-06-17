// src/pages/ConfirmPayment.tsx

import { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import StepIndicator from "../others/StepIndicator";
import { useCart } from "../context/CartContext";

interface Customer {
  name: string;
  email: string;
  mobile: string;
  billingAddress: string;
  shippingAddress: string;
  gst?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ConfirmPayment() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    gst,
    grandTotal,
    initialized
  } = useCart();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  /* ---------------- LOAD CUSTOMER ---------------- */
  useEffect(() => {
    const storedCustomer = localStorage.getItem("checkoutCustomer");

    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }

    setLoadingCustomer(false);
  }, []);

  /* ---------------- SAFETY CHECK ---------------- */
  useEffect(() => {

  // Only run logic on confirm-order page
  if (location.pathname !== "/confirm-order") return;

  if (!initialized || loadingCustomer) return;

  if (!customer) {
    toast.error("Customer details missing");
    navigate("/place-order", { replace: true });
    return;
  }

  if (cartItems.length === 0) {
    toast.error("Your cart is empty. Redirecting to shop.");
    navigate("/shop", { replace: true });
  }

}, [initialized, loadingCustomer, cartItems, customer, navigate, location]);

  /* ---------------- LOADING SCREEN ---------------- */
  if (!initialized || loadingCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading order details...
      </div>
    );
  }

  if (!customer) return null;

  /* ---------------- HANDLERS ---------------- */

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        totalAmount: grandTotal,
        customer,
        cartItems,
        subtotal,
        gst
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const totalItems = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">

      <StepIndicator currentStep={3} />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* CUSTOMER DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Your Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Mobile:</strong> {customer.mobile}</p>

              {customer.gst && (
                <p><strong>GST:</strong> {customer.gst}</p>
              )}
            </div>
          </div>

          {/* ADDRESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <p className="whitespace-pre-line text-gray-700">
                {customer.billingAddress}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="whitespace-pre-line text-gray-700">
                {customer.shippingAddress}
              </p>
            </div>

          </div>

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">
              Items ({totalItems})
            </h3>

            {cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4 last:border-b-0 gap-4"
              >
                <div className="flex items-center gap-4">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>

                </div>

                <p className="font-semibold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">

          <h3 className="text-lg font-semibold mb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-gray-700">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total Payable</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

          </div>

          <div className="mt-6 space-y-3">

            <button
              onClick={handleProceedToPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Proceed to Payment
            </button>

            <button
              onClick={handleBack}
              className="w-full border py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}