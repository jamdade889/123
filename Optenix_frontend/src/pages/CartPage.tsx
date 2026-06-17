// src/pages/CartPage.tsx

import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import StepIndicator from "../others/StepIndicator";

export default function CartPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const {
    cartItems,
    removeFromCart,
    clearCart,
    addToCart,
    initialized
  } = useCart();

  /* WAIT FOR CART LOAD */
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading cart...</p>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (id: string, newQty: number) => {

    const item = cartItems.find((i) => i.id === id);

    if (!item || newQty < 1) return;

    addToCart({
      ...item,
      quantity: newQty - item.quantity,
    });
  };

  /* EMPTY CART */

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Your Cart is Empty
        </h2>

        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 sm:py-16">

      <StepIndicator currentStep={1} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* CART ITEMS */}

          <div className="lg:col-span-8 space-y-5">

            {cartItems.map((item) => (

              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4"
              >

                <div className="flex flex-col sm:flex-row gap-4">

                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain bg-gray-50 rounded-xl p-3"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">

                    <div>

                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center sm:text-left">
                        {item.name}
                      </h3>

                      <div className="flex justify-center sm:justify-start mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-blue-400 text-blue-400"
                          />
                        ))}
                      </div>

                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <span className="text-blue-900 font-bold text-lg text-center sm:text-left">
                        ₹{item.price}
                      </span>

                      <div className="flex justify-center sm:justify-start items-center gap-3">

                        <span className="text-sm font-medium text-gray-600">
                          Qty:
                        </span>

                        <div className="flex items-center border rounded-lg overflow-hidden">

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                            className="px-3 py-1 text-lg font-bold hover:bg-gray-100 disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="px-4 py-1 font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                          >
                            +
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="flex justify-center sm:justify-end">

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* SUMMARY */}

          <div className="lg:col-span-4">

            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">

              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4 text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">₹{total}</span>
              </div>

              <button
                onClick={() => {

                  if (!user) {
                    navigate("/login", {
                      state: {
                        from: location.pathname,
                        redirectTo: "/place-order",
                      },
                    });
                  } else {
                    navigate("/place-order");
                  }

                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="w-full mt-4 text-blue-600 text-sm hover:underline"
              >
                ← Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}