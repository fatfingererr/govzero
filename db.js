const mongoose = require("mongoose")

// DDAO
// mongodb+srv://<user></user>:<password>@ddao.n7b87r2.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ddao.n7b87r2.mongodb.net/?retryWrites=true&w=majority`
)

const db = mongoose.connection
db.on("error", (err) => {
  console.error("MongoDB error: ", err.message)
  process.exit(1)
})

db.once("open", () => {
  console.log("MongoDB connection established")
})

module.exports = mongoose
