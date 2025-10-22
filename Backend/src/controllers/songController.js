import Song from "../models/songModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addSong = async (req, res) => {
  try {
    const { name, description, album } = req.body;
    
    if (!req.files || !req.files['image'] || !req.files['audio']) {
      return res.status(400).json({
        success: false,
        message: "Image and audio files are required"
      });
    }
    
    const imageFile = req.files['image'][0].path;
    const audioFile = req.files['audio'][0].path;

    console.log("📥 Adding song:", { name, description, album });

    let imageUpload, audioUpload;

    try {
      // Upload image to Cloudinary
      imageUpload = await cloudinary.uploader.upload(imageFile, {
        resource_type: "image",
      });

      // Upload audio to Cloudinary
      audioUpload = await cloudinary.uploader.upload(audioFile, {
        resource_type: "video",
      });
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload error:", cloudinaryError);
      return res.status(400).json({
        success: false,
        message: "File upload failed. Please check your files and try again."
      });
    }

    // Estimate duration based on file size (fallback method)
    let duration = "0:00";
    try {
      const stats = fs.statSync(audioFile);
      const fileSizeInMB = stats.size / (1024 * 1024);
      // Rough estimate: 1MB ≈ 1 minute for MP3
      const estimatedMinutes = Math.max(1, Math.round(fileSizeInMB));
      const estimatedSeconds = Math.round((fileSizeInMB - Math.floor(fileSizeInMB)) * 60);
      duration = `${estimatedMinutes}:${estimatedSeconds.toString().padStart(2, '0')}`;
      console.log("🎵 Estimated duration:", duration);
    } catch (durationError) {
      console.warn("⚠️ Could not estimate duration:", durationError.message);
    }

    const songData = {
      name: name || "Unknown Song",
      desc: description || "No description",
      album: album === "none" ? "Single" : (album || "Unknown Album"),
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration: duration,
      createdAt: new Date()
    };

    const song = new Song(songData);
    await song.save();

    // Clean up temporary files
    try {
      fs.unlinkSync(imageFile);
      fs.unlinkSync(audioFile);
    } catch (cleanupError) {
      console.warn("⚠️ Could not clean up temp files:", cleanupError.message);
    }

    console.log("✅ Song added successfully:", { 
      id: song._id, 
      name: song.name, 
      duration: song.duration 
    });
    
    return res.status(200).json({ 
      success: true,
      message: "Song added successfully", 
      song 
    });
    
  } catch (error) {
    console.error("❌ Add song error:", error);
    
    // Clean up temp files on error
    try {
      if (req.files?.['image']?.[0]?.path) fs.unlinkSync(req.files['image'][0].path);
      if (req.files?.['audio']?.[0]?.path) fs.unlinkSync(req.files['audio'][0].path);
    } catch (cleanupError) {
      console.warn("⚠️ Could not clean up temp files on error:", cleanupError.message);
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Error adding song to database", 
      error: error.message 
    });
  }
};

export const listSong = async (req, res) => {
  try {
    const songs = await Song.find({}).sort({ createdAt: -1 });
    console.log("🎵 Songs found:", songs.length);
    
    res.status(200).json({
      success: true,
      data: songs,
      count: songs.length
    });
  } catch (error) {
    console.error("List songs error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching songs" 
    });
  }
};

export const removeSong = async (req, res) => {
  try {
    const result = await Song.findByIdAndDelete(req.body.id);
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: "Song not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      message: "Song deleted successfully" 
    });
  } catch (error) {
    console.error("Remove song error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting song" 
    });
  }
};

export const likeSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user?.userId; // Get user ID from auth middleware
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    if (!songId) {
      return res.status(400).json({ 
        success: false, 
        message: "Song ID is required" 
      });
    }

    // Import User model
    const User = (await import("../models/userModel.js")).default;
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: "Song not found" 
      });
    }

    // Add song to user's liked songs if not already liked
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (!user.likedSongs.includes(songId)) {
      user.likedSongs.push(songId);
      await user.save();
    }

    res.status(200).json({ 
      success: true, 
      message: "Song liked successfully" 
    });
  } catch (error) {
    console.error("Like song error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error liking song" 
    });
  }
};

export const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user?.userId; // Get user ID from auth middleware
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    if (!songId) {
      return res.status(400).json({ 
        success: false, 
        message: "Song ID is required" 
      });
    }

    // Import User model
    const User = (await import("../models/userModel.js")).default;
    
    // Remove song from user's liked songs
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Song unliked successfully" 
    });
  } catch (error) {
    console.error("Unlike song error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error unliking song" 
    });
  }
};

export const addToRecentlyPlayed = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user?.userId; // Get user ID from auth middleware
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    if (!songId) {
      return res.status(400).json({ 
        success: false, 
        message: "Song ID is required" 
      });
    }

    // Import User model
    const User = (await import("../models/userModel.js")).default;
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ 
        success: false, 
        message: "Song not found" 
      });
    }

    // Get user and update recently played
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Remove song if already in recently played (and clean up any null references)
    user.recentlyPlayed = user.recentlyPlayed.filter(item => item.song && item.song.toString() !== songId);
    
    // Add song to beginning of recently played
    user.recentlyPlayed.unshift({
      song: songId,
      playedAt: new Date()
    });

    // Keep only last 5 songs
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 5);
    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Song added to recently played" 
    });
  } catch (error) {
    console.error("Add to recently played error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error adding to recently played" 
    });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    const userId = req.user?.userId; // Get user ID from auth middleware
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    // Import User model
    const User = (await import("../models/userModel.js")).default;
    
    // Get user with populated liked songs
    const user = await User.findById(userId).populate('likedSongs');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      likedSongs: user.likedSongs || [] 
    });
  } catch (error) {
    console.error("Get liked songs error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching liked songs" 
    });
  }
};

export const getRecentlyPlayed = async (req, res) => {
  try {
    const userId = req.user?.userId; // Get user ID from auth middleware
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    // Import User model
    const User = (await import("../models/userModel.js")).default;
    
    // Get user with populated recently played songs
    const user = await User.findById(userId).populate('recentlyPlayed.song');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Sort by playedAt date (most recent first) and include playedAt timestamp
    const recentlyPlayed = user.recentlyPlayed
      .filter(item => item.song !== null && item.song !== undefined) // Remove null songs first
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
      .map(item => ({
        ...item.song.toObject(),
        playedAt: item.playedAt
      }));

    res.status(200).json({ 
      success: true, 
      recentlyPlayed: recentlyPlayed || [] 
    });
  } catch (error) {
    console.error("Get recently played error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching recently played songs" 
    });
  }
};