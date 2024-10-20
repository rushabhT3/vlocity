const Poll = require("../models/Poll");
const User = require("../models/User");

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({ question, options, createdBy: req.userId });
    await poll.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { createdPolls: poll._id },
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: "Error creating poll" });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.userId;

    // Find the poll and check if it exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if the option index is valid
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    // Check if the user has already voted
    const existingVote = poll.votes.find(
      (vote) => vote.user.toString() === userId
    );
    if (existingVote) {
      return res
        .status(400)
        .json({ message: "You have already voted in this poll" });
    }

    // Add the new vote
    poll.votes.push({ user: userId, option: optionIndex });
    await poll.save();

    // Fetch the updated poll with populated data
    const updatedPoll = await Poll.findById(pollId)
      .populate("createdBy", "username")
      .populate("votes.user", "username");

    // Emit the updated poll to all connected clients in the poll room
    const io = req.app.get("socketio");
    io.to(`poll_${pollId}`).emit("voteUpdate", updatedPoll);

    res.json(updatedPoll);
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Error casting vote" });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: "Error fetching poll" });
  }
};

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching polls" });
  }
};
