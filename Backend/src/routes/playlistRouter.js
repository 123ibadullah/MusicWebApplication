import express from "express";
import { 
  createPlaylist, 
  getPlaylists, 
  getPlaylistById, 
  addSongToPlaylist,
  deletePlaylist,
  removeSongFromPlaylist,
  testPlaylist
} from "../controllers/playlistController.js";

const router = express.Router();

// Test endpoint
router.get("/test", testPlaylist);

// CRUD operations
router.post("/create", createPlaylist);
router.get("/list", getPlaylists);
router.get("/:id", getPlaylistById);
router.post("/add-song", addSongToPlaylist);
router.delete("/delete/:id", deletePlaylist);
router.post("/remove-song", removeSongFromPlaylist);

export default router;