var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//insterted code
var monk = require('monk');
var fs = require('fs');
var http = require('http');
var Options = require('obfuscator').Options;
var obfuscator = require('obfuscator').obfuscator;
var index = require('./routes/index');
var users = require('./routes/users');
var gateKeeper = require('./routes/gateKeeper');
var obuscateJS = require('./routes/obuscateJS');
var login = require('./routes/login');
var winston = require('winston');
//var query = require('./public/javascript/query');
var public_path = __dirname + "/public";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
//Front-end assets
app.use('/query.js', obuscateJS('/query.js'));
app.use('/uploadAlgo.js', obuscateJS('/uploadAlgo.js'));
app.use('/bundle.js', obuscateJS('/bundle.js'));
app.use('/loginFront.js', obuscateJS('/loginFront.js'));

app.use('/gateKeeper',gateKeeper);
app.use('/login',login);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
