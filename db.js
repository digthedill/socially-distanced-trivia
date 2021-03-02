const mongoose = require("mongoose")

const url = process.env.MONGO_URL

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

mongoose.connect(url, connectionParams)

const db = mongoose.connection

module.exports = db
