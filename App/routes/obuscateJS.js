


function wrapper(assetName){
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var http = require('http');
  var uglifyJS = require("uglify-js");

  var dynamicPATH = __dirname;
  dynamicPATH = dynamicPATH.slice(0,-7);
  dynamicPATH += '/public/javascript';
  //console.log(dynamicPATH+assetName);

  return router.get('/',function(req,res,next){

    fs.readFile(dynamicPATH+assetName, function(err,data)
        {
          var result = uglifyJS.minify(dynamicPATH+assetName,{mangle: {toplevel: true, except:["globalSymbol", "processedStockData", "graphHome"]}});
          //console.log(result.code); // minified output
          res.send(result.code);
          //res.send(data.toString());
        }); //end fs file read function call
    });//end app.use function call
   //uglifyJS.mangle(public_path+assetName); //probably doesnt even go here
   /*added this comment to test caching glitch theory111*/

}//end wrapper function

module.exports = wrapper;
//module.exports = router;
