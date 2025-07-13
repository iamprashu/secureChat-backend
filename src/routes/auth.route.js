import express from "express";
import {
  checkAuth,
  updateProfile,
  syncClerkUser,
  syncClerkUserPublic,
} from "../controllers/auth.controller.js";
import { verifyClerkToken } from "../middleware/clerkAuth.js";

const router = express.Router();

// Handle OPTIONS requests for all routes
router.options("*", (req, res) => {
  res.status(200).end();
});

router.get("/check", verifyClerkToken, checkAuth);
router.post("/sync-clerk", verifyClerkToken, syncClerkUser);
router.put("/update-profile", verifyClerkToken, updateProfile);

router.post("/sync-clerk-public", syncClerkUserPublic);

export default router;
