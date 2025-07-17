import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { createSocketServer } from "./lib/socket.js";
import { setSocketInstance } from "./lib/socketInstance.js";

dotenv.config();

console.log("Environment:", process.env.NODE_ENV);
console.log("CORS allowed origins:", [
  // "https://secure-chat-ecru.vercel.app",
  "http://localhost:5173",
  "http://192.168.0.101:5173",
]);

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log("Request headers:", req.headers);
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
        "https://securechat-backend-qgtd.onrender.com",
        "https://securechat-backend-qgtd.onrender.com",
    ];
    

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Origin, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

app.get("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS POST test successful",
    origin: req.headers.origin,
    body: req.body,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    console.log("CORS error:", err.message);
    return res.status(403).json({
      error: "CORS error",
      message: "Origin not allowed",
      origin: req.headers.origin,
    });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;

// Create socket.io server
const io = createSocketServer(server);
setSocketInstance(io);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

export default app;
