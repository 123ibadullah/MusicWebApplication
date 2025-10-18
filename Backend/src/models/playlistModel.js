import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "My playlist" 
  },
  songs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Song'  // FIX: Reference 'Song' with capital S
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// FIX: Use consistent naming - "Playlist" with capital P
const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;