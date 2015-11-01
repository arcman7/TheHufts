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
var index = require('./routes/index');
var users = require('./routes/users');
var gateKeeper = require('./routes/gateKeeper');
var obuscateJS = require('./routes/obuscateJS');
var login = require('./routes/login');
//mozilla session manager
var session = require('client-sessions');//mozilla
//secondary session management options
//package.json: "express-session": "^1.7.6"
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);

// var winston = require('winston');

//var query = require('./public/javascript/query');
var public_path = __dirname + "/public";

var app = express();
var sess;
app.use(session({
  cookieName: 'session',
  secret: "aaa",//gateKeeper.randomString(77,"aA#!"),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

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
app.use('/users', users);
//Storing user-sessions

//console.log(gateKeeper.randomString(77,"aA#!"));
app.use(function(req, res, next) {
  //console.log(req);
  if (req.session && req.session.user) {
    //console.log(req.session);
    //Parse initialization
    var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
    var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
    Parse.initialize(parseSecret1, parseSecret2);
    //Parse initalization END
    login.queryParseUser({email: req.session.user.email});
  } else {
    next();
  }
});

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
