import express from "express";
import {
  addSong,
  listSong,
  removeSong,
  likeSong,
  unlikeSong,
  getLikedSongs,
  addToRecentlyPlayed,
  getRecentlyPlayed
} from "../controllers/songController.js";
import upload from "../middleware/multer.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const songRouter = express.Router();

songRouter.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);
songRouter.get("/list", listSong);
songRouter.post("/remove", removeSong);
songRouter.post("/like", authenticateToken, likeSong);
songRouter.post("/unlike", authenticateToken, unlikeSong);
songRouter.get("/liked", authenticateToken, getLikedSongs);
songRouter.post("/recently-played", authenticateToken, addToRecentlyPlayed);
songRouter.get("/recently-played", authenticateToken, getRecentlyPlayed);

export default songRouter;
