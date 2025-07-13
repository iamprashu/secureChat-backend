import express from "express";
import { verifyClerkToken } from "../middleware/clerkAuth.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Handle OPTIONS requests for all routes
router.options("*", (req, res) => {
  res.status(200).end();
});

// All routes now use Clerk authentication
router.get("/users", verifyClerkToken, getUsersForSidebar);
router.get("/:id", verifyClerkToken, getMessages);
router.post("/send/:id", verifyClerkToken, sendMessage);

export default router;
