const multer = require('multer');
const path = require('path');

const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
      .populate('createdPolls')
      .populate('votedPolls');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = { username, email };
    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile" });
  }
};
