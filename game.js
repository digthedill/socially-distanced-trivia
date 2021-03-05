const axios = require("axios")
const User = require("./models/User")
const { getUsersInRoom } = require("./utils/users")

const fetchQuestions = async () => {
  const request = await axios({
    method: "get",
    baseURL: "https://opentdb.com/api.php?amount=10&type=multiple",
  })

  return request.data.results
}

const startGame = (socket, io, room) => {
  socket.on("start", async () => {
    console.log("Game has started!")
    await User.updateMany(
      { room },
      {
        gameStarted: true,
      }
    )
    socket.to(room).emit("gameStartedInRoom")

    let questions = await fetchQuestions()

    questions.forEach((question) => {
      question.multipleChoice = [
        ...question.incorrect_answers,
        question.correct_answer,
      ]
      question.multipleChoice.sort(() => Math.random() - 0.5)
    })

    const endGameTrigger = {
      category: "",
      type: "",
      difficulty: "",
      question: "",
      correct_answer: "",
      incorrect_answers: ["", "", ""],
      multipleChoice: ["", "", "", ""],
    }
    questions.push(endGameTrigger)

    // implement correct question display

    questions.forEach((question, i) => {
      setTimeout(() => {
        io.to(room).emit("timedQuestion", { ...question, index: i })
        setTimeout(() => {
          io.to(room).emit("showAnswer", question.correct_answer)
          setTimeout(() => {
            io.to(room).emit("clearAnswer")
          }, 11500)
        }, 10000)

        if (i === questions.length - 1) {
          io.to(room).emit("endOfGame")
          endRound(io, room)
        }
      }, i * 12000)
    })
  })
}

const endRound = async (io, room) => {
  // grab all users in room
  // increment round to within user model
  await User.updateMany(
    {
      room: room,
    },
    {
      $inc: { round: 1 },
    }
  )
  const usersInRoom = await getUsersInRoom(room)

  const highScore = Math.max.apply(
    null,
    usersInRoom.map((user) => user.score)
  )

  const roundWinner = usersInRoom.filter((user) => user.score === highScore)

  if (roundWinner) {
    io.to(room).emit("roundWinner", roundWinner)
  }
}

module.exports = {
  startGame,
}
