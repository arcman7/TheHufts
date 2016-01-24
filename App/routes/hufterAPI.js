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

function getUserAlgo(req,res,next){
   //Parse.Cloud.useMasterKey();
   //console.log("getUserAlgo req.body: " + JSON.stringify(req.body));
   var requestType = "getAlgoFiles";
   var User        = Parse.Object.extend("UserC");
   var query       = new Parse.Query(User);
   var response    = req.body;
   console.log("hufterAPI: ",req.body);
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
        //var relation     = object.relation("algos");
        var tempRelation = object.relation("tempAlgos");
        tempRelation.query().find().then(
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
                    var key = sha3(user.username+"TheHufts");
                    var algoFile = aesDecrypt(encryptedAlgo,key);
                    req.body.algo = algoFile;
                    req.body.lang = algo.get("fileType");
                    return;
                  }
                });
                //req.algo = list;
              }
              req.user = user;
              req.session.user = user;  //refresh the session value
              req.session.user.session_id = session_id;
              res.locals.user  = user;

               console.log("req.session size: "+ roughSizeOfObject(req.session));
               //var domain = 'localhost:3001/';
               //var domain   = req.body.domain; //dont think we need domain in this route
               var hufter_domain = "hufter.herokuapp.com";
               var backtest      = '/backtest';
               var protocol      = req.body.protocol;
               var algo          = req.body.algo;
               var data = {algo: algo,"startDate": req.body.startDate,"endDate": req.body.endDate, "symbols": req.body.symbols, "lang": req.body.lang };
               //console.log(data);
               data = JSON.stringify(data);
               //console.log(data);
               data = aesEncrypt(data,"yolocity");
               data = encodeURIComponent(data);
               var fullQuery = protocol + "//" + hufter_domain + backtest + "?data="+data;
               console.log("hufter API query: "+fullQuery);
               new Promise(function (resolve, reject){
                  var request = needle.get(fullQuery,
                    function(err, response, body){
                      res.send(response.body)
                    }
                  );
                  resolve(request);
                }).then(function (response){
                  //console.log(response);
                  //res.send(response);
                });

               //next();
            },
            function (error){
              console.log( "line 90 hufterAPI users-algos error: "+error);
              next();
            }
          );//end relation-then function
      },//end query user success function
      function (error) {
        console.log(" line 100 hufterAPI.js LOGIN-Error: " + error.code + " " + error.message);
        next();
      }
    ); //end query-first user
  return;
}


router.post('/',function (req,res,next){
  new Promise(function(resolve,reject){
    resolve(getUserAlgo(req,res,next))
  })
});//router post-end

module.exports = router;
