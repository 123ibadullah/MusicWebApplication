import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Remove deprecated options for newer Mongoose versions
    await mongoose.connect(`${process.env.MONGO_URI}/spotify`);
    
    console.log("✅ MongoDB connected successfully");
    
    // Log registered models for debugging
    mongoose.connection.on("connected", () => {
      console.log("📋 Registered models:", Object.keys(mongoose.models));
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
  });
};

export default connectDB;