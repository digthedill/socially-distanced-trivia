const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  score: Number,
  socketId: String,
})

userSchema.index(
  {
    username: 1,
    room: 1,
  },
  {
    unique: true,
  }
)

const User = new mongoose.model("User", userSchema)

module.exports = User
