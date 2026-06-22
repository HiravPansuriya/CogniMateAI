import express from "express";
import {
  authUser,
  registerUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/google", googleAuth);
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

export default router;
