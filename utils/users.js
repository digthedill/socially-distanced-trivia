const User = require("../models/User")
// const users = [];

const addUser = async ({ username, room, socketId }) => {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if (!username || !room) {
    return {
      error: "Username and Room are required",
    }
  }

  // figure out a way to check for in use username's (schema)

  // Store User
  const doc = new User({
    username,
    room,
    score: 0,
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
  console.log("have you made it this far???")
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
