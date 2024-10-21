const socketIo = require("socket.io");

const initSocketIO = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    // console.log("New client connected");

    socket.on("newPollCreated", (newPoll) => {
      console.log("New poll created:", newPoll);
      io.emit("newPollCreated", newPoll);
    });

    socket.on("joinAllPollsRoom", () => {
      socket.join("allPolls");
      console.log("Client joined allPolls room");
    });

    socket.on("leaveAllPollsRoom", () => {
      socket.leave("allPolls");
      console.log("Client left allPolls room");
    });

    socket.on("joinPollRoom", (pollId) => {
      socket.join(`poll_${pollId}`);
      console.log(`Client joined room: poll_${pollId}`);
    });

    socket.on("leavePollRoom", (pollId) => {
      socket.leave(`poll_${pollId}`);
      console.log(`Client left room: poll_${pollId}`);
    });

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

  return io;
};

module.exports = { initSocketIO };
