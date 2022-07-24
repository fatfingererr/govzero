const db = require("../../db")

const HOLDER_MODEL_NAME = "Holder"

const holderSchema = db.Schema({
  address: String,
  name: { type: String, unique: true },
})

const Holder = db.model(
    HOLDER_MODEL_NAME,
    holderSchema,
  HOLDER_MODEL_NAME
)

module.exports = {
    HOLDER_MODEL_NAME,
    Holder
}
