import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  message: string;
  rating: number;
}

export default function AdminTestimonials() {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    message: "",
    rating: 5,
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/testimonials");

      // 🔥 FIX for map error
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setTestimonials(data);
    } catch (error) {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ✅ Add Testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/api/testimonials", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Testimonial added successfully");
      setForm({ name: "", designation: "", message: "", rating: 5 });
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to add testimonial");
    }
  };

  // ✅ Delete Testimonial
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/testimonials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Manage Testimonials
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg mb-10 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Designation"
            value={form.designation}
            onChange={(e) =>
              setForm({ ...form, designation: e.target.value })
            }
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg font-medium"
        >
          Add Testimonial
        </button>
      </form>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500">Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-500">No testimonials found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {t.name}
              </h3>
              <p className="text-sm text-gray-500">
                {t.designation}
              </p>
              <p className="mt-3 text-gray-700">
                {t.message}
              </p>

              <button
                onClick={() => handleDelete(t._id)}
                className="mt-4 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}