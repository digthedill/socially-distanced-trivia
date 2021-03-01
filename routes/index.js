const express = require("express");
const cors = require("cors");
const request = require("request");
const router = express.Router();

router.use(cors());
router.get("/", (req, res) => {
  res
    .send({ response: "Welcome to the trivia api using socket.io and react" })
    .status(200);
});

router.get("/start", (req, res) => {
  request({
    uri: "https://opentdb.com/api.php?amount=10",
  }).pipe(res);
});

module.exports = router;

// store data for all clients....

// client emit start
//server makes the router request
//server emits response to all clients in the game room
