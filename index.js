var path = require('path')
var express = require("express")
var app = express()
const port = process.env.PORT || 3000;

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'statics')))

app.get("/", function (req, res) {
  res.render("index", {
    daoname: "DDAO"
  })
})

app.listen(port, function () {
  console.log(`Example app listening on: http://localhost:{port}`)
})
