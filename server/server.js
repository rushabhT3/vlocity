const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB via Mongoose");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinPoll", (pollId) => {
    socket.join(`poll_${pollId}`);
  });

  socket.on("leavePoll", (pollId) => {
    socket.leave(`poll_${pollId}`);
  });

  socket.on("joinCommentRoom", (pollId) => {
    socket.join(`comments_${pollId}`);
  });

  socket.on("leaveCommentRoom", (pollId) => {
    socket.leave(`comments_${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.set("socketio", io);

const authRoutes = require("./routes/auth");
const pollRoutes = require("./routes/polls");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
