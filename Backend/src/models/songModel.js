import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    default: "Unknown Song"
  },
  desc: { 
    type: String, 
    required: true,
    default: "No description" 
  },
  album: { 
    type: String, 
    required: true,
    default: "Single" 
  },
  image: { 
    type: String, 
    required: true 
  },
  file: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: String, 
    required: true,
    default: "0:00" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// FIX: Use consistent naming - "Song" with capital S
const Song = mongoose.model("Song", songSchema);
export default Song;