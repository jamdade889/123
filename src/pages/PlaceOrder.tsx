import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

//Step Indicator
import StepIndicator from "../others/StepIndicator";

export default function PlaceOrder() {
  const { user } = useAuth();
  const { cartItems, initialized , subtotal,gst,grandTotal} = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    gstNumber: "",
    companyName: "",
    billingAddress: "",
    shippingAddress: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gstLoading, setGstLoading] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [errors, setErrors] = useState({
    billingAddress: "",
    shippingAddress: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!initialized) return;

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setForm({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      gstNumber: "",
      companyName: "",
      billingAddress: user.address || "",
      shippingAddress: user.address || "",
    });
  }, [user, cartItems, initialized, navigate]);

  if (!user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- OTP ---------------- */
  const sendOtp = async () => {
    if (!form.email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      setOtpLoading(true);
      await api.post("/api/auth/otp/send", { email: form.email });
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Enter valid OTP");
      return;
    }

    try {
      setOtpLoading(true);
      await api.post("/api/auth/otp/verify", { email: form.email, otp });
      toast.success("Email verified successfully");
      setOtpVerified(true);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // gst number verification
  const verifyGST = async () => {
    if (!form.gstNumber || form.gstNumber.length !== 15) {
      toast.error("Enter valid 15-digit GST number");
      return;
    }

    try {
      setGstLoading(true);

      const res = await api.post("/api/gst/verify", {
        gstNumber: form.gstNumber,
      });

      setForm({
        ...form,
        companyName: res.data.companyName,
        billingAddress: res.data.address,
      });

      setGstVerified(true);
      toast.success("GST verified successfully");
    } catch (error) {
      toast.error("Invalid GST Number");
    } finally {
      setGstLoading(false);
    }
  };

  /* ---------------- CONTINUE ---------------- */
 const handleContinue = () => {
  if (!otpVerified) {
    toast.error("Please verify your email before continuing.");
    return;
  }

  let hasError = false;
  const newErrors = { billingAddress: "", shippingAddress: "" };

  if (!form.billingAddress || form.billingAddress.trim().length < 10) {
    newErrors.billingAddress =
      "Billing address must be at least 10 characters.";
    toast.error("Please enter a valid billing address.");
    hasError = true;
  }

  if (
    !sameAsBilling &&
    (!form.shippingAddress || form.shippingAddress.trim().length < 10)
  ) {
    newErrors.shippingAddress =
      "Shipping address must be at least 10 characters.";
    toast.error("Please enter a valid shipping address.");
    hasError = true;
  }

  if (!form.mobile || form.mobile.trim().length < 10) {
    toast.error("Please enter a valid mobile number.");
    hasError = true;
  }

  setErrors(newErrors);

  if (hasError) return;

  /* 🔥 SAVE CUSTOMER FOR CONFIRM PAGE */
  localStorage.setItem(
    "checkoutCustomer",
    JSON.stringify({
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      gst: form.gstNumber,
      billingAddress: form.billingAddress,
      shippingAddress: sameAsBilling
        ? form.billingAddress
        : form.shippingAddress,
    })
  );

  /* 🔥 GO TO CONFIRM PAGE */
  navigate("/confirm-order");
};

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <StepIndicator currentStep={2} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ================= LEFT SECTION ================= */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6 md:p-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
            Checkout Details
          </h2>

          {/* Contact */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* OTP Section */}
          {!otpVerified && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <button
                  onClick={sendOtp}
                  disabled={otpLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                >
                  {otpLoading
                    ? "Sending..."
                    : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                </button>

                {otpSent && (
                  <>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="border rounded-lg p-2 flex-1"
                    />
                    <button
                      onClick={verifyOtp}
                      disabled={otpLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                      Verify
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {otpVerified && (
            <p className="text-green-600 font-semibold mb-6">
              ✓ Email verified successfully
            </p>
          )}

          {/* Mobile */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* GST Section */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">
              GST Number (For Business Purchase)
            </label>

            <div className="flex gap-3 mt-1">
              <input
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
                placeholder="Enter 15-digit GST Number"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={verifyGST}
                disabled={gstLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
              >
                {gstLoading ? "Verifying..." : "Verify"}
              </button>
            </div>

            {gstVerified && (
              <p className="text-green-600 text-sm mt-2">
                ✅ GST Verified Successfully
              </p>
            )}
          </div>

          {form.companyName && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600">
                Company Name
              </label>
              <input
                value={form.companyName}
                readOnly
                className="mt-1 w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>
          )}
          {/* Billing Address */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">
              Billing Address *
            </label>
            <textarea
              name="billingAddress"
              value={form.billingAddress}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.billingAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.billingAddress}
              </p>
            )}
          </div>

          {/* Shipping Checkbox */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => setSameAsBilling(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            <span className="text-gray-700 text-sm">
              Shipping address same as billing
            </span>
          </div>

          {/* Shipping Address */}
          {!sameAsBilling && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600">
                Shipping Address *
              </label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.shippingAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingAddress}
                </p>
              )}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition shadow-md"
          >
            Continue to Payment →
          </button>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3">
            Order Summary
          </h2>

          <div className="space-y-5">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover border"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-bold text-blue-600 mt-1">
                   ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ UPDATED TOTAL SECTION */}
          <div className="border-t mt-6 pt-4 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
