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
// var minify = require('express-minify');
var winston = require('winston');
//var query = require('./public/javascript/query');
var public_path = __dirname + "/public";

var app = express();
   app.use(function(req,res, next){
        // console.log(req.path);
        //console.log("full path: ",public_path+'javascript/'+req.path);
        //next();
      // res.send(UglifyJS.minify(public_path+req.path));
    fs.readFile(public_path+'/javascript/'+req.path, function(err,data)
        {
          //console.log(data.toString());
          if (err) throw err;
          var options = new Options([public_path+'/javascript/'+req.path],public_path+'/javascript/',req.path, true);
          options.compressor = {
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true
          };
          //res.send(jsfuck.encode(data.toString()));
            obfuscator(options, function (err, obfuscated) {
                if (err) {
                  throw err;
                }
                //console.log(obfuscated)
                res.send(obfuscated);
            }); //end obfuscator function call
        }); //end fs file read function call
    });//end app.use function call
    app.use(function(req, res) {
        res.statusCode = 404;
        res.end("Not found");
    });
    app.use(function(err, req, res, next) {
        console.error(err);
        res.statusCode = 500;
        res.end("Internal server error");
    });
//});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
//app.use(minify());
// app.use(minify(
// {
//     js_match: /javascript/,
//     css_match: /css/,
//     sass_match: /scss/,
//     less_match: /less/,
//     stylus_match: /stylus/,
//     coffee_match: /coffeescript/,
//     json_match: /json/,
//     cache: false
// }));




app.use('/', index);
app.use('/users', users);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
