import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { verifyClerkToken } from "./middleware/clerkAuth.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { server, io } from "./lib/socket.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://secure-chat-ecru.vercel.app"]
        : ["http://localhost:5173", "http://192.168.0.101:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

export default app;
