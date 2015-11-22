var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Parse      = require('parse/node');

//insterted code

var monk = require('monk');
var fs   = require('fs');
var http = require('http');

//routes
var index         = require('./routes/index');
var users         = require('./routes/users');
var gateKeeper    = require('./routes/gateKeeper');
var obuscateJS    = require('./routes/obuscateJS');
var login         = require('./routes/login');
var checkLogin    = require('./routes/checkLogin');
var saveAlgo      = require('./routes/saveAlgo');
var getAlgoNames  = require('./routes/getAlgoNames');
var resetSessionAlgos = getAlgoNames.resetSessionAlgos;
//mozilla session manager
var session = require('client-sessions');//mozilla
//error logger for node
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

//Storing user-sessions
app.use(session({
  cookieName: 'session',
  secret: "TheHuftsMotherFucker",//gateKeeper.randomString(77,"aA#!"),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  cookie: {
    path: "/"
  }
}));


app.use(function(req, res, next) {
  //console.log("hi from app.use session-checker global-middleware, req.path: " + req.path);
  // console.log("req.session: " + JSON.stringify(req.session));
  // console.log("req.cookies: ", JSON.stringify(req.cookies));
  console.log("app.use req.session: "+JSON.stringify(req.session));

  // if( req.path == "/getAlgoNames" ){
  //   //async function call
  //   //resetSessionAlgos(req.body.username,req,res);
  //    new Promise(function(resolve, reject){
  //       // resetSessionAlgos(req.body.username,req,res);
  //       resolve(resetSessionAlgos(req.body.username,req,res,next));
  //     })
  //     // .then(function(){
  //     //    console.log("/getAlgoNames app.use req.session: "+JSON.stringify(req.session));
  //     //    next();
  //     // });
  //   //req.session.user = {username: "hufty", email: "thehufts@gmail.com"};

  // }
  // else{
    if (req.session && req.session.user) {
      //Parse initialization
      var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
      var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
      Parse.initialize(parseSecret1, parseSecret2);
      //Parse initalization END
      console.log("*****************req.path: "+req.path);

      login.queryParseUser({email: req.session.user.email, algos: req.session.user.algos },req,res,next);
      //console.log("req.session: ", JSON.stringify(req.session));
      //console.log("req.cookies: ", req.cookies);
    }
    else {
      next();
    }
  // }//end else-77
});

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(function(err, req, res, next) {
//     console.log("hi from global middleware");

//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
//   next();
// });

app.use('/', index);
//Front-end assets
app.use('/query.js', obuscateJS('/query.js'));
app.use('/uploadAlgo.js', obuscateJS('/uploadAlgo.js'));
app.use('/bundle.js', obuscateJS('/bundle.js'));
app.use('/loginFront.js', obuscateJS('/loginFront.js'));
//Routes
app.use('/gateKeeper',gateKeeper);
app.use('/login',login);
app.use('/users', users);
app.use('/checkLogin', checkLogin);
app.use('/saveAlgo',saveAlgo);
app.use('/getAlgoNames',getAlgoNames);
//if no matching route is found this is the default server response
// app.use(function(req, res, next) {
//   console.log("error middle ware, requested resource path: "+ req.path);
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

module.exports = app;
