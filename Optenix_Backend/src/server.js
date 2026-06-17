// Load environment variables
//Loads .env into process.env
// Required for MongoURI,PORT,JWT_SECRET
import dotenv from "dotenv";
dotenv.config();


// import express and cors
import express from "express";
import cors from "cors";

// all routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import gstRoutes from "./routes/gstRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
// Express app initialization
// it is exported to index.js
// Creates Express instance using Express
const app = express();

// Middleware FIRST
// CORS configuration
// Frontend login
// ✔ Cookies / JWT
// ✔ Admin authorization
// ✔ Cart API calls
app.use(cors({
  origin:[
    "http://localhost:5173",
    "https://www.optenix.in",
    "https://optenix.in"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials:true
}));

app.options("/*", cors());  
// app.options("/", cors());   // किंवा
// app.options("*", cors({ origin: true }));


// Body Parsing middleware
//Allows:
// JSON requests
// Form submissions
// Image uploads (base64)
// Required for:
// Login
// Register
// Product creation
// Carousel uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));



// Routes
// App Routes
// this affects frontend
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/testimonials",testimonialRoutes);
app.use("/api/gst",gstRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/categories", categoryRoutes); 


// Test route
// Health check issues
// Used to verify backend is alive
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

export default app;
