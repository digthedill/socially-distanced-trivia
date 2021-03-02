const express = require("express")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
require("dotenv").config()

const { startGame } = require("./game")
const {
  addUser,
  removeUser,
  getUsersInRoom,
  updateUserScore,
  getUser,
} = require("./utils/users")

const db = require("./db")

const app = express()
app.use(cors())

const port = process.env.PORT || 4412
const indexRoute = require("./routes")

app.use(indexRoute)
const server = http.createServer(app)

const io = socketIo(server)

db.once("open", () => {
  console.log("connected to mongoDB")
})

io.on("connection", (socket) => {
  console.log("a user has joined")
  socket.emit("welcomeMsg", "")

  // USER REGISTRATION

  socket.on("join", async (payload) => {
    const user = await addUser({
      ...payload,
      socketId: socket.id,
    })
    const usersInRoom = await getUsersInRoom(user.room)

    socket.join(user.room)
    socket.emit("message", `${user.username} welcome to ${user.room}`)

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: usersInRoom,
    })

    // Game Logistics

    startGame.init(socket, io, user.room)
  })

  socket.on("userScore", async ({ user, room }) => {
    // update user score
    const updated = await updateUserScore(user, room)
    console.log("on userScore recieval:", updated)
    const usersInRoom = await getUsersInRoom(room)

    if (updated) {
      io.to(room).emit("roomData", {
        room: room,
        users: usersInRoom,
      })
    }
  })

  socket.on("disconnect", async () => {
    const user = await getUser(socket.id)
    let room = user.room
    const confirmDelete = await removeUser(socket.id)
    const usersInRoom = await getUsersInRoom(room)

    if (confirmDelete.deletedCount === 1) {
      io.to(room).emit("message", `${user.username} has left`)
      io.to(room).emit("roomData", {
        room: room,
        users: usersInRoom,
      })
    }
  })
})

server.listen(port, () => {
  console.log(`serving on ${port}`)
})
