const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { text, pollId } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.userId;

    const comment = await Comment.create({
      text,
      poll: pollId,
      user: userId,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username"
    );

    // Emit the new comment to all clients in the room
    req.app
      .get("socketio")
      .to(`comments_${pollId}`)
      .emit("newComment", populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ message: "Error creating comment", error: error.message });
  }
};

exports.getCommentsForPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const comments = await Comment.find({ poll: pollId })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};
