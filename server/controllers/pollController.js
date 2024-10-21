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

    const populatedPoll = await Poll.findById(poll._id).populate(
      "createdBy",
      "username"
    );

    const io = req.app.get("socketio");
    io.to("allPolls").emit("newPoll", populatedPoll);

    res.status(201).json(populatedPoll);
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Error creating poll" });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.userId;
    let poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }
    const existingVoteIndex = poll.votes.findIndex(
      (vote) => vote.user.toString() === userId
    );
    if (existingVoteIndex !== -1) {
      return res
        .status(400)
        .json({ message: "You have already voted in this poll" });
    }
    poll.votes.push({ user: userId, option: optionIndex });
    await poll.save();

    await User.findByIdAndUpdate(userId, {
      $push: { votedPolls: poll._id },
    });

    const updatedPoll = await Poll.findById(pollId)
      .populate("createdBy", "username")
      .populate("votes.user", "username");

    // const io = req.app.get("socketio");
    // io.to(`poll_${pollId}`).emit("pollUpdated", updatedPoll);

    req.app
      .get("socketio")
      .to(`poll_${pollId}`)
      .emit("pollUpdated", updatedPoll);

    res.json({ message: "Vote cast successfully" });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Error casting vote" });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("votes.user", "username");
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
