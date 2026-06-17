import Testimonial from "../models/Testimonial.js";

// Add testimonial (Admin)
export const createTestimonial = async (req, res) => {
  try {
    const { name, designation, message, rating, image } = req.body;

    const testimonial = await Testimonial.create({
      name,
      designation,
      message,
      rating,
      image
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all active testimonials (Public)
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete testimonial (Admin)
export const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};