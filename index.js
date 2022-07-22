var path = require("path")
var express = require("express")
var bodyParser = require("body-parser")

var app = express()
var db = require("./db")

const port = process.env.PORT || 3000

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "statics")))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mode = process.argv[2]
let serverUrl = `http://localhost:${port}`
if (mode === "prod") serverUrl = "http://ddao.azurewebsites.net"

app.get("/", function (req, res) {
  res.render("index", {
    daoname: "DDAO",
    serverUrl
  })
})
app.get("/api/scoreProposal/count", (req, res, next) => {
  var sql = "SELECT * FROM scoreProposal ORDER BY serial_id DESC LIMIT 1;"
  db.get(sql, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    let count = 0
    if (row !== undefined) {
      count = row.serial_id
    }
    console.log("row:", JSON.stringify(row))
    res.json({
      message: "success",
      count
    })
  })
})

app.post("/api/scoreProposal/", (req, res, next) => {
  var errors = []
  
  const { offset, limit } = req.body
  console.log('offset:', offset)
  console.log('limit:', limit)
  if (offset === undefined) errors.push("No offset specified")
  if (limit === undefined) errors.push("No limit specified")
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }
  var sql = `SELECT * FROM scoreProposal ORDER BY serial_id DESC LIMIT ${limit} OFFSET ${offset}` //  OFFSET ${offset} LIMIT ${limit}
  console.log('sql:', sql)
  db.all(sql, function (err, data) {
    
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    console.log('data:', data)
    res.status(200).json({
      message: "success",
      data
    })
  })
})

app.post("/api/scoreProposal/delete", (req, res, next) => {
  var errors = []
  const data = JSON.parse(Object.keys(req.body)[0])
  const { serial_id } = data
  if (!serial_id) errors.push("No serial id specified")
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }
  var sql = `DELETE FROM scoreProposal WHERE serial_id = ${serial_id}`
  db.run(sql, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: "success",
      result
    })
  })
})

app.post("/api/scoreProposal/create", (req, res, next) => {
  var errors = []
  //const data = JSON.parse(Object.keys(req.body)[0])
  const {
    proposal_id,
    proposer,
    receiver,
    amount,
    description,
    transaction_hash,
    propose_time
  } = req.body
  if (!proposal_id) errors.push("No proposal id specified")
  if (!proposer) errors.push("No proposer specified")
  if (!receiver) errors.push("No receiver specified")
  if (!amount) errors.push("No amount specified")
  if (!description) errors.push("No description specified")
  if (!propose_time) errors.push("No propose time specified")
  if (!transaction_hash) errors.push("No transaction hash specified")

  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }
  var sql =
    "INSERT INTO scoreProposal (proposal_id, proposer, receiver, amount, description, transaction_hash, propose_time) VALUES (?,?,?,?,?,?,?)"
  var params = [
    proposal_id,
    proposer,
    receiver,
    amount,
    description,
    transaction_hash,
    propose_time
  ]
  console.log("params:", JSON.stringify(params))
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: "success"
    })
  })
})

app.listen(port, function () {
  console.log(`Example app listening on: ${serverUrl}`)
})
