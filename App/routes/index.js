var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TheHufts' });
});

var fs = require('fs');
var http = require('http');
var Options = require('obfuscator').Options;
var obfuscator = require('obfuscator').obfuscator;
var public_path = __dirname + "/public";

module.exports = router;
