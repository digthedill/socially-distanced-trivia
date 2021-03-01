const mongoose = require("mongoose");

const url = `mongodb+srv://admin:louvinbros@cluster0.pcsom.mongodb.net/trivia_app?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(url, connectionParams);

const db = mongoose.connection;

module.exports = db;
