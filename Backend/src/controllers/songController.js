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
    res.status(200).json({ 
      success: true, 
      message: "Song liked" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error liking song" 
    });
  }
};

export const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.body;
    res.status(200).json({ 
      success: true, 
      message: "Song unliked" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error unliking song" 
    });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      likedSongs: [] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching liked songs" 
    });
  }
};