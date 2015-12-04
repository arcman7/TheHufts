var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var session    = require('client-sessions');

router.get('/', function (req, res) {
  var data = {};
  if (req.session && req.session.user) {
    data.loggedIn = true;
    res.send(data);
  }
  else{
    data.redirect = "http://localhost:3000/logIn";
    res.send(data);
  }
});//end router-get
module.exports = router;

