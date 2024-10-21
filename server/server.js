const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");

const { initSocketIO } = require("./socket");

const authRoutes = require("./routes/auth");
const pollRoutes = require("./routes/polls");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initSocketIO(server);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Make io accessible to our router
app.set("socketio", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
