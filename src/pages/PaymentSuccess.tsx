import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../others/StepIndicator";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: auto redirect to shop after 5 seconds
    const timer = setTimeout(() => {
      navigate("/shop");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">

        <StepIndicator currentStep={4} />

        <div className="mt-6">
          <div className="text-green-600 text-5xl mb-4">✓</div>

          <h2 className="text-2xl font-bold mb-2">
            Payment Successful
          </h2>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}