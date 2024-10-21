const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB via Mongoose");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

const authRoutes = require("./routes/auth");
const pollRoutes = require("./routes/polls");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinCommentRoom", (pollId) => {
    socket.join(`comments_${pollId}`);
    console.log(`Client joined room: comments_${pollId}`);
  });

  socket.on("leaveCommentRoom", (pollId) => {
    socket.leave(`comments_${pollId}`);
    console.log(`Client left room: comments_${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Make io accessible to our router
app.set("socketio", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
