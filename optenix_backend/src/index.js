
// Load environment variables
//Loads .env into process.env
// Required for MongoURI,PORT,JWT_SECRET
import dotenv from "dotenv";
// Connect to database
//Calls the MongoDB connection before server starts
import connectDB from "./config/db.js";
// Import Express app
//server.js does NOT start the server
//It only configures Express
import app from "./server.js";

dotenv.config();

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
// Starts HTTP server using Node.js
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
