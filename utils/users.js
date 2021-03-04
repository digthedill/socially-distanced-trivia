const User = require("../models/User")

const addUser = async ({ username, room, admin, socketId }) => {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()
  // Store User
  const doc = new User({
    username,
    room,
    admin,
    score: 0,
    round: 1,
    socketId,
  })
  // save to database
  return doc.save()
}
const removeUser = async (socketId) => {
  const user = await User.deleteOne({
    socketId,
  })
  return user
}
const getUser = async (socketId) => {
  const user = await User.findOne({
    socketId,
  }).exec()
  return user
}

const updateUserScore = async (username, room) => {
  const user = await User.findOneAndUpdate(
    {
      username,
      room,
    },
    {
      $inc: { score: 1 },
    },
    {
      useFindAndModify: false,
      new: true,
    }
  )
  return user
}

const getUsersInRoom = async (room) => {
  if (room) {
    room = room.trim().toLowerCase()
    const users = await User.find({ room: room })
    // console.log("in the getUsers f:", users);
    return users
  }
  return []
}

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
  updateUserScore,
}
