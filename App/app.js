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
var obuscateJS = require('./routes/obuscateJS');
var winston = require('winston');
//var query = require('./public/javascript/query');
var public_path = __dirname + "/public";

var app = express();
   // app.get('/query.js',function(req,res, next){
   //       console.log(req.path);
   //      console.log('\n');

   //      console.log("full path: ",public_path+'/javascript'+req.path);
   //      console.log('\n');
   //      //next();
   //    // res.send(UglifyJS.minify(public_path+req.path));
   //  fs.readFile(public_path+'/javascript'+req.path, function(err,data)
   //      {
   //        //console.log(data.toString());
   //        if (err) throw err;
   //        var options = new Options([public_path+'/javascript/'+req.path],public_path+'/javascript/',req.path, true);
   //        options.compressor = {
   //          conditionals: true,
   //          evaluate: true,
   //          booleans: true,
   //          loops: true,
   //          unused: true,
   //          hoist_funs: true
   //        };
   //        //res.send(jsfuck.encode(data.toString()));
   //          obfuscator(options, function (err, obfuscated) {
   //              if (err) {
   //                throw err;
   //              }
   //              res.send(obfuscated);
   //          }); //end obfuscator function call
   //      }); //end fs file read function call
   //  });//end app.use function call
    // app.use(function(req, res) {
    //     res.statusCode = 404;
    //     res.end("Not found");
    // });
    // app.use(function(err, req, res, next) {
    //     console.error(err);
    //     res.statusCode = 500;
    //     res.end("Internal server error");
    // });
//});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
///app.use('/users', users);
app.use('/query.js', obuscateJS('/query.js'));
app.use('/uploadAlgo.js', obuscateJS('/uploadAlgo.js'));
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
