import express from "express";
import {
  uploadNote,
  getNotes,
  getNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getNotes);
router.post("/upload", protect, upload.single("file"), uploadNote);
router.post("/text", protect, uploadNote);
router.route("/:id").get(protect, getNote).delete(protect, deleteNote);

export default router;
