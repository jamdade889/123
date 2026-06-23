import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const updatedUser = {
        ...user,
        name,
        email,
      };

      updateUser(updatedUser);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
          My Profile
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm sm:text-base mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm sm:text-base"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm sm:text-base mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm sm:text-base"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3 sm:py-3.5 rounded-lg font-semibold transition text-sm sm:text-base text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}