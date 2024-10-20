const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  createdPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
  votedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
});

module.exports = mongoose.model('User', UserSchema);
