


function wrapper(assetName){
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var http = require('http');
  var uglifyJS = require("uglify-js");
    //  if (module.exports.storedData == "DrunkenZebra"){
    //   console.log("shit works");
    // }
  // var obfuscator = require('obfuscator').obfuscator;
  // var Options = require('obfuscator').Options;
  var public_path = "/Users/Jedi_scholar/Desktop/phase-4/hiring_mixers/TheHufts/App" + '/public/javascript';//+assetName;
  //console.log(public_path+assetName);
  return router.get('/',function(req,res,next){
        // console.log(req.path);
    console.log("full path: ",public_path+assetName);
        //next();
      // res.send(UglifyJS.minify(public_path+req.path));
    fs.readFile(public_path+assetName, function(err,data)
        {
          var result = uglifyJS.minify(public_path+assetName,{mangle: {toplevel: true, except:["globalSymbol", "processedStockData", "graphHome"]}});
          //console.log(result.code); // minified output
          res.send(result.code);
          //res.send(data.toString());
        }); //end fs file read function call
    });//end app.use function call
   //uglifyJS.mangle(public_path+assetName); //probably doesnt even go here
   /*added this comment to test caching glitch theory111*/

}//end wrapper function

module.exports = wrapper;
// module.exports.storedData = "DrunkenZebra";
// console.log(module.exports);
//module.exports = router;