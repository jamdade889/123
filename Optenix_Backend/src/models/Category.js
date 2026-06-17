import mongoose from "mongoose";


//import router from "../routes/categoryRoutes";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  subCategories: [
    {
      type: String,
    },
  ],

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model(
  "Category",
  categorySchema
);