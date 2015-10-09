
//__dirname +
//var app = express();

function wrapper(assetName){
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var http = require('http');
  var obfuscator = require('obfuscator').obfuscator;
  var Options = require('obfuscator').Options;
  var public_path = "/Users/Jedi_scholar/Desktop/phase-4/hiring_mixers/TheHufts/App" + '/public/javascript';//+assetName;
  //console.log(public_path+assetName);
  return router.get('/',function(req,res,next){
        // console.log(req.path);
    console.log("full path: ",public_path+assetName);
        //next();
      // res.send(UglifyJS.minify(public_path+req.path));
    fs.readFile(public_path+assetName, function(err,data)
        {
          console.log(data.toString());
          if (err) throw err;
          var options = new Options([public_path+assetName],public_path,assetName, true);
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
}
module.exports = wrapper;
//module.exports = router;