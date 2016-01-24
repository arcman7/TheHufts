var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var SHA3       = require("crypto-js/sha3");
var session    = require('client-sessions');
var needle     = require('needle');

var roughSizeOfObject = require('./getAlgoNames').roughSizeOfObject
function aesDecrypt(string,key){
  var decrypted       = AES.decrypt(string, key);
  var decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
  return decryptedString;
}

function aesEncrypt(string,key){
  var encrypted       = AES.encrypt(string,key);
  //var encryptedString = CryptoJS.enc.Utf8.stringify(encrypted);
  var encryptedString = encrypted.toString();
  return encryptedString;
}

function sha3(string){
  var hashedString = SHA3(string).toString();
  return hashedString;
}

//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END

function getUserAlgo(req,res,next,object){
  var tempRelation = object.relation("tempAlgos");
  return tempRelation.query().find().then(
    function (list){
       console.log("hufterAPI: list: ",list);
       if (list.length == 0){  //the user has no uploaded algos
         req.algo = false
       }
       else{ //storing users algos in user object
         list.forEach(function (algo){
           console.log(req.body.filename,algo.get("name"));
           if(req.body.filename === algo.get("name")){
             var encryptedAlgo = algo.get("encryptedString");
             var key = sha3(object.get("username")+"TheHufts");
             var algoFile = aesDecrypt(encryptedAlgo,key);
             req.body.algo = algoFile;
             req.body.lang = algo.get("fileType");
             return;
           }
         }); //end list.forEach
         //req.algo = list;
       }//end else
       var hufter_domain = "hufter.herokuapp.com";
       var backtest      = '/backtest';
       var protocol      = req.body.protocol;
       var algo          = req.body.algo;
       var data = {algo: algo,"startDate": req.body.startDate,"endDate": req.body.endDate, "symbols": req.body.symbols, "lang": req.body.lang };
       data = JSON.stringify(data);
       data = aesEncrypt(data,"yolocity");
       data = encodeURIComponent(data);
       var fullQuery = protocol + "//" + hufter_domain + backtest + "?data="+data;
       console.log("hufter API query: "+fullQuery);
       hufterAPIQuery(fullQuery,res);
     },
     function (error){
       console.log( "getUserAlgo hufterAPI users-algos error: "+error);
       next();
     }
   );//end relation-then function
}

function getDemoAlgo(req,res,next,object){
  var DemoAlgo  = Parse.Object.extend("DemoAlgo");
  var demoQuery = new Parse.Query(DemoAlgo);
  demoQuery.find().then(
    function (list){
      console.log("getDemoAlgo.list: ")
      list.forEach(function (algo){
        //console.log(req.body.filename,algo.get("name"));
        console.log(algo.get("name"),req.body.filename);
        if(req.body.filename === algo.get("name")){
          var key = sha3(object.get("username")+"TheHufts");
          var algoFile = algo.get("encryptedString");
          //console.log(algoFile);
          req.body.algo = algoFile;
          req.body.lang = algo.get("fileType");
          return;
        }
      }); //end list.forEach
       var hufter_domain = "hufter.herokuapp.com";
       var backtest      = '/backtest';
       var protocol      = req.body.protocol;
       var algo          = req.body.algo;
       var data = {algo: algo,"startDate": req.body.startDate,"endDate": req.body.endDate, "symbols": req.body.symbols, "lang": req.body.lang };
       console.log(data);
       data = JSON.stringify(data);
       data = aesEncrypt(data,"yolocity");
       data = encodeURIComponent(data);
       var fullQuery = protocol + "//" + hufter_domain + backtest + "?data="+data;
       console.log("hufter API query: "+fullQuery);
       hufterAPIQuery(fullQuery,res);
    },
    function (error){
      console.log("could not get DemoAlgos");
      console.log(error);
      res.send(error)
    }
  );//end demoQuery.find().then()
}

function hufterAPIQuery(fullQuery,res){
  new Promise(function (resolve, reject){
    var request = needle.get(fullQuery,
      function (err, response, body){
        res.send(response.body)
      }
    );
    resolve(request);
  }).then(function (response){
    //console.log(response);
    //res.send(response);
  });
}

function getAlgo(req,res,next){
  var User        = Parse.Object.extend("UserC");
  var query       = new Parse.Query(User);
  var username = aesDecrypt(req.body.username, "TheHufts");
  query.equalTo( 'username', username )//.select(userAttributes);
    query.first().then(
      function (object) {
        console.log("LOGIN: Successfully retrieved user" + object.get("username"));
        var accessToken = object.get('accessToken');
        /////////////////////////////////////////////////////
        //setting the session to the logged in user
        var user         = {};
        user.accessToken = accessToken;
        user.username    = object.get('username');
        user.email       = object.get('email');
        var session_id   = aesEncrypt(user.username, "TheHufts");
        req.user         = user;
        req.session.user = user;  //refresh the session value
        req.session.user.session_id = session_id;
        res.locals.user  = user;
        console.log("req.session size: " + roughSizeOfObject(req.session));

        if(JSON.parse(req.body.demo)){
          getDemoAlgo(req,res,next,object);
        }else{//get users algo
          getUserAlgo(req,res,next,object);
        }
      },//end query user success function
      function (error) {
        console.log(" hufterAPI getAlgo get user error: " + error.code + " " + error.message);
        next();
      }
    ); //end query-first user
 return;
}


router.post('/',function (req,res,next){
    //Parse.Cloud.useMasterKey();
   console.log("hufter API: " + JSON.stringify(req.body));
   var requestType = "getAlgoFiles";
   var username = aesDecrypt(req.body.username, "TheHufts");

  new Promise(function(resolve,reject){
    resolve(getAlgo(req,res,next))
  });
});//router post-end

module.exports = router;
