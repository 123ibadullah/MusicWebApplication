import express from "express";
import cors from "cors";
import "dotenv/config";
import songRouter from "./src/routes/songRouter.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRouter.js";
import playlistRouter from "./src/routes/playlistRouter.js";
import authRouter from "./src/routes/authRoutes.js";

// Import models to ensure they're registered before routes
import "./src/models/songModel.js";
import "./src/models/albumModel.js";
import "./src/models/playlistModel.js";
import "./src/models/userModel.js";

// App config
const app = express();
const port = process.env.PORT || 4000; // FIX: Changed 'port' to 'PORT'

// Connect to databases
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Test routes
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Backend is working!",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/test-upload", (req, res) => {
  console.log("Test upload received:", req.body);
  res.json({ 
    success: true, 
    message: "Upload endpoint is reachable",
    received: req.body 
  });
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const dbStatus = mongoose.default.connection.readyState === 1 ? "Connected" : "Disconnected";
    
    res.json({ 
      status: "OK", 
      database: dbStatus,
      timestamp: new Date().toISOString(),
      models: Object.keys(mongoose.default.models)
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      error: error.message 
    });
  }
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/playlist", playlistRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

app.listen(port, () => console.log(`✅ Server listening on localhost:${port}`));