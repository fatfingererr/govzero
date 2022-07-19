var path = require('path')
var express = require("express")
var app = express()

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'statics')))

app.get("/", function (req, res) {
  res.render("index", {
    daoname: "DDAO"
  })
})

app.listen(3000, function () {
  console.log("Example app listening on: http://localhost:3000")
})
