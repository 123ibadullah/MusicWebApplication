import Playlist from "../models/playlistModel.js";
import Song from "../models/songModel.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    const playlist = new Playlist({
      name,
      description: description || "My playlist",
      user: userId
    });
    await playlist.save();
    
    console.log(`✅ Playlist created for user ${userId}:`, name);
    res.status(201).json({ success: true, playlist });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    console.log(`Fetching playlists for user: ${userId}`);
    const playlists = await Playlist.find({ user: userId }).populate('songs');
    console.log(`Found ${playlists.length} playlists for user ${userId}`);
    res.status(200).json({ success: true, playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    const playlist = await Playlist.findOne({ 
      _id: req.params.id, 
      user: userId 
    }).populate('songs');
    
    if (!playlist) {
      return res.status(404).json({ 
        success: false, 
        message: "Playlist not found or access denied" 
      });
    }
    
    res.status(200).json({ success: true, playlist });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    console.log("Adding song to playlist:", { playlistId, songId, userId });
    
    const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
    const song = await Song.findById(songId);
    
    if (!playlist) {
      console.log("Playlist not found or access denied:", playlistId);
      return res.status(404).json({ 
        success: false, 
        message: "Playlist not found or access denied" 
      });
    }
    
    if (!song) {
      console.log("Song not found:", songId);
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    // Check if song already exists in playlist
    const songExists = playlist.songs.some(song => song.toString() === songId);
    
    if (!songExists) {
      playlist.songs.push(songId);
      await playlist.save();
      console.log("Song added to playlist successfully");
    } else {
      console.log("Song already exists in playlist");
    }

    const updatedPlaylist = await Playlist.findById(playlistId).populate('songs');
    res.status(200).json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    console.log("Deleting playlist:", id, "for user:", userId);
    
    const playlist = await Playlist.findOneAndDelete({ _id: id, user: userId });
    if (!playlist) {
      console.log("Playlist not found for deletion or access denied:", id);
      return res.status(404).json({ 
        success: false, 
        message: "Playlist not found or access denied" 
      });
    }
    
    console.log("Playlist deleted successfully:", id);
    res.status(200).json({ success: true, message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    console.log("Removing song from playlist:", { playlistId, songId, userId });
    
    const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
    
    if (!playlist) {
      console.log("Playlist not found for removal or access denied:", playlistId);
      return res.status(404).json({ 
        success: false, 
        message: "Playlist not found or access denied" 
      });
    }

    // Remove the song from the playlist
    const initialLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
    
    if (playlist.songs.length === initialLength) {
      console.log("Song not found in playlist for removal:", songId);
      return res.status(404).json({ success: false, message: "Song not found in playlist" });
    }
    
    await playlist.save();
    console.log("Song removed from playlist successfully");

    const updatedPlaylist = await Playlist.findById(playlistId).populate('songs');
    res.status(200).json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Test function
export const testPlaylist = async (req, res) => {
  try {
    console.log("✅ Playlist test endpoint hit successfully!");
    res.status(200).json({ 
      success: true, 
      message: "Playlist backend is working!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cleanup old playlists without user field
export const cleanupOldPlaylists = async (req, res) => {
  try {
    console.log("🧹 Cleaning up old playlists without user field...");
    
    // Delete all playlists that don't have a user field
    const result = await Playlist.deleteMany({ user: { $exists: false } });
    
    console.log(`✅ Deleted ${result.deletedCount} old playlists`);
    
    res.status(200).json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} old playlists without user field`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error cleaning up playlists:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};