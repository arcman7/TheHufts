var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var Options = require('obfuscator').Options;
var obfuscator = require('obfuscator').obfuscator;
var public_path = __dirname + "/public";
router.get('/assets',function(req,res,next){
        // console.log(req.path);
        console.log("full path: ",public_path+'javascript/'+req.path);
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
                res.send(obfuscated);
            }); //end obfuscator function call
        }); //end fs file read function call
    });//end app.use function call

module.exports = router;