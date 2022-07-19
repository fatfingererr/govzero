/*
    browserify scripts/web3_init.js -o statics/js/web3_bundle.js
*/
var Web3 = require("web3")
if (typeof web3 !== "undefined") {
  console.debug(web3.currentProvider)
  web3 = new Web3(web3.currentProvider)
} else {
  alert("No currentProvider for web3")
}
