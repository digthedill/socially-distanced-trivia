const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  room: String,
  score: Number,
  socketId: String,
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
