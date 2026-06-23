// It allows JavaScript objects to map directly to MongoDB collections
// Mongoose ODM(object data modelling)
import mongoose from "mongoose";

// Async function because DB connection is non-blocking
// This function is usually called once when the server starts

const connectDB = async () => {
  try {
    //If .env is missing or incorrect → server stops immediately
    // Prevents silent failures
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined");
    // Uses connection string from .env
    await mongoose.connect(process.env.MONGO_URI);
    //Confirm DB is live
    console.log("MongoDB connected");
    
  } 
    // Logs only the error message
    // error handling
    catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// exporting the function
// which is going to used in server.js and index.jas
export default connectDB;
