import express from "express";
import {
  checkAuth,
  updateProfile,
  syncClerkUser,
} from "../controllers/auth.controller.js";
import { verifyClerkToken } from "../middleware/clerkAuth.js";

const router = express.Router();

// All routes now use Clerk authentication
router.get("/check", verifyClerkToken, checkAuth);
router.post("/sync-clerk", verifyClerkToken, syncClerkUser);
router.put("/update-profile", verifyClerkToken, updateProfile);

export default router;
