const axios = require("axios")

const fetchQuestions = async () => {
  const request = await axios({
    method: "get",
    baseURL: "https://opentdb.com/api.php?amount=10&type=multiple",
  })

  return request.data.results
}

const startGame = {
  init(socket, io, room) {
    socket.on("start", async () => {
      console.log("Game has started!")

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

      questions.forEach((question, i) => {
        setTimeout(() => {
          io.to(room).emit("timedQuestion", { ...question, index: i })

          if (i === questions.length - 1) {
            io.to(room).emit("endOfGame")
          }
        }, i * 5000)
      })
    })
  },
}

module.exports = {
  startGame,
}
