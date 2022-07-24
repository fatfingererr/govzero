require("dotenv").config()

var path = require("path")
var express = require("express")
var bodyParser = require("body-parser")

var app = express()
require("./db")

mintProposalModel = require("./models/proposal/mint/model")
holderModel = require("./models/holder/model")

const port = process.env.PORT || 3000

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "statics")))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mode = process.argv[2]
let serverUrl = `http://localhost:${port}`
if (mode === "prod") serverUrl = process.env.SERVER_URL

app.get("/", function (req, res) {
  res.render("index", {
    daoname: process.env.DAO_NAME,
    serverUrl,
    token: process.env.TOKEN_ADDRESS,
    governor:  process.env.GOVERNOR_ADDRESS,
    governorType: process.env.GOVERNOR_TYPE
  })
})

app.post("/api/holder/update", (req, res, next) => {
  holderModel
    .updateHolder(req.body)
    .then(() =>
      res.json({
        message: "success"
      })
    )
    .catch((err) => res.status(400).json({ message: err }))
})

app.post("/api/holder/all", (req, res, next) => {
  holderModel
    .getAllHolders()
    .then((holders) =>
      res.json({
        message: "success",
        data: holders
      })
    )
    .catch((err) => res.status(400).json({ error: err.message }))
})

app.post("/api/proposal/update", (req, res, next) => {
  var errors = []
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }
  mintProposalModel
    .updateProposal(req.body)
    .then(() =>
      res.json({
        message: "success"
      })
    )
    .catch((err) => res.status(400).json({ error: err.message }))
})


app.post("/api/proposal/find", (req, res, next) => {
  var errors = []
  if (req.body.proposalId === undefined) errors.push("No proposal id specified")
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }
  mintProposalModel
    .findProposal(req.body)
    .then((proposal) =>
      res.json({
        message: "success",
        data: proposal
      })
    )
    .catch((err) => res.status(400).json({ error: err.message }))
})

app.post("/api/proposal/", (req, res, next) => {
  var errors = []
  const { offset, limit } = req.body
  if (offset === undefined) errors.push("No offset specified")
  if (limit === undefined) errors.push("No limit specified")
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }
  mintProposalModel
    .getMintProposals(offset, limit)
    .then((proposals) =>
      res.json({
        message: "success",
        data: proposals
      })
    )
    .catch((err) => res.status(400).json({ error: err.message }))
})

app.post("/api/proposal/mint/create", (req, res, next) => {
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

  mintProposalModel
    .createMintProposal(
      proposal_id,
      proposer,
      receiver,
      amount,
      description,
      Number(propose_time),
      transaction_hash
    )
    .then(() => {
      const receivers = [receiver]
      holderModel
        .getNewHolders(receivers)
        .then((newHolders) => {
          holderModel
            .addHolders(newHolders.addresses, newHolders.names)
            .then(() => {
              res.json({
                message: "success"
              })
            })
            .catch((err) => res.status(400).json({ error: err.message }))
        })
        .catch((err) => res.status(400).json({ error: err.message }))
    })
    .catch((err) => res.status(400).json({ error: err.message }))
})

app.post("/api/proposal/batchmint/create", (req, res, next) => {
  var errors = []
  //const data = JSON.parse(Object.keys(req.body)[0])
  const {
    proposalId,
    proposer,
    receivers,
    amounts,
    description,
    proposeTx,
    proposeTime
  } = req.body
  if (!proposalId) errors.push("No proposal id specified")
  if (!proposer) errors.push("No proposer specified")
  if (!receivers) errors.push("No receivers specified")
  if (!amounts) errors.push("No amounts specified")
  if (!description) errors.push("No description specified")
  if (!proposeTime) errors.push("No propose time specified")
  if (!proposeTx) errors.push("No transaction hash specified")

  if (errors.length) {
    res.status(400).json({ error: errors.join(",") })
    return
  }

  mintProposalModel
    .createBatchMintProposal(
      proposalId,
      proposer,
      receivers,
      amounts,
      description,
      Number(proposeTime),
      proposeTx
    )
    .then(() => {
      holderModel
        .getNewHolders(receivers)
        .then((newHolders) => {
          holderModel
            .addHolders(newHolders.addresses, newHolders.names)
            .then(() => {
              res.json({
                message: "success"
              })
            })
            .catch((err) => res.status(400).json({ error: err.message }))
        })
        .catch((err) => res.status(400).json({ error: err.message }))
    })
    .catch((err) => res.status(400).json({ error: err.message }))
})

// app.post("/api/scoreProposal/create", (req, res, next) => {
//   var errors = []
//   //const data = JSON.parse(Object.keys(req.body)[0])
//   const {
//     proposal_id,
//     proposer,
//     receiver,
//     amount,
//     description,
//     transaction_hash,
//     propose_time
//   } = req.body
//   if (!proposal_id) errors.push("No proposal id specified")
//   if (!proposer) errors.push("No proposer specified")
//   if (!receiver) errors.push("No receiver specified")
//   if (!amount) errors.push("No amount specified")
//   if (!description) errors.push("No description specified")
//   if (!propose_time) errors.push("No propose time specified")
//   if (!transaction_hash) errors.push("No transaction hash specified")

//   if (errors.length) {
//     res.status(400).json({ error: errors.join(",") })
//     return
//   }
//   var sql =
//     "INSERT INTO scoreProposal (proposal_id, proposer, receiver, amount, description, transaction_hash, propose_time) VALUES (?,?,?,?,?,?,?)"
//   var params = [
//     proposal_id,
//     proposer,
//     receiver,
//     amount,
//     description,
//     transaction_hash,
//     propose_time
//   ]
//   console.log("params:", JSON.stringify(params))

//   var db = new sqlite3.Database("./main.db")
//   db.run(sql, params, function (err) {
//     console.log("err:", JSON.stringify(err))
//     if (err) {
//       res.status(400).json({ error: err.message })
//       db.close()
//       return
//     }
//     res.json({
//       message: "success"
//     })
//     db.close()
//   })
// })

app.listen(port, function () {
  console.log(`Example app listening on: ${serverUrl}`)
})
