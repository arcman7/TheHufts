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

function getUserAlgo(req,res,next){
   console.log("getUserAlgo req.body: " + JSON.stringify(req.body));
   var requestType = "getAlgoFiles";
   var User        = Parse.Object.extend("UserC");
   var query       = new Parse.Query(User);
   var response    = req.body;
    query.equalTo( 'username', req.body.username )//.select(userAttributes);
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
        //var relation     = object.relation("algos");
        var tempRelation = object.relation("tempAlgos");
        tempRelation.query().find().then(
            function (list){
              if (list.length == 0){  //the user has no uploaded algos
                req.algo = false
              }
              else{ //storing users algos in user object
                list.forEach(function(algo){
                  var encryptedAlgo = algo.get("encryptedString");
                  var key = sha3(user.username+"TheHufts");
                  var algoFile = aesDecrypt(encryptedAlgo,key);
                  //console.log(algoFile);

                  if(req.body.filename == algo.get("name")){
                    //console.log(algoFile);
                    req.body.algo = algoFile;
                    return;
                  }
                });
                //req.algo = list;
              }
              req.user = user;
              req.session.user = user;  //refresh the session value
              res.locals.user  = user;
               //console.log("req.session resetSessionAlgos: ", JSON.stringify(req.session));
               console.log("req.session size: "+ roughSizeOfObject(req.session));
               var domain = 'localhost:3001/';
               var backtest = 'backtest';
               var algo = req.body.algo;
               var data = {algo: algo,"startDate": req.body.startDate,"endDate": req.body.endDate, "symbols": req.body.symbols, "lang":req.body.lang };
               console.log(data);
               data = JSON.stringify(data);
               algo = aesEncrypt(data,"yolocity");
               algo = encodeURIComponent(algo);
               var fullQuery = "http://"+ domain + backtest + "?data="+algo;
               console.log("hufter API query: "+fullQuery);
              new Promise(function (resolve, reject){
                  var request = needle.get(fullQuery,
                    function(err, response, body){
                      //console.log(resp);
                      res.send(response.body)
                    }
                  );
                  resolve(request);
                }).then(function (response){
                  //console.log(response);
                  //res.send(response);
                });

               //next();
              // console.log("req.cookies: resetSessionAlgos: ", req.cookies);
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
  }).then(function (response){
      // var domain = 'localhost:3001/';
      // var backtest = 'backtest';
      // var algo = req.algo;
      // var data = {algo: algo};
      // algo = aesEncrypt(data,"yolocity");
      // algo = encodeURIComponent(algo);
      // var fullQuery = "http://"+ domain + backtest + "?data="+algo;
      // console.log("hufter API query: "+fullQuery);
      // new Promise(function (resolve, reject){
      //   var request = needle.get(fullQuery,
      //     function(err, resp, body){
      //       console.log(body);
      //     }
      //   );
      //   resolve(request);
      // }).then(function (response){
      //   console.log(response);
      //   res.send(response)
      // });
  });
  //getUserAlgo(req,res,next);




});//router post-end

module.exports = router;
// var data = decodeURIComponent('U2FsdGVkX19KoFMSyLxTiuCleINyRNU6AO2YY24ltji02RnQd%2FS6XiPCzi9CUTHuNgXxBEQG%2B22XdAxwmCX64h%2B%2BPGeZzKB39Yo63sEH6YyLWHR3GNxrDUGRHoz8HKJXs5Tk7b%2FXaKub9tKFQ6Qr3eRZoFjXun06nPRb36WZtpCDmTAcJ7Z4yK%2FoJuRhCaVaZLSsaRAi0TJ8MEDYGX7rIdMbCAj5FpBE3uYYF2uLyczcYrOwN3h7njBphhgXpktB4CI2iGJ7rVQpTbG%2BzGbPKeHmWpzu4eYrt7QtiMHuK5Q7cgS06b7roU1qmJarjygW%2BKFlDjqIKUEFiFIgJFAg7b0Lal2%2BWTFiXAQupLWeM7ZJYxbVl%2BwiOsBiCYTHSb2jfhHTZ%2FYIcdogTHAWbq%2BFpgPMZIG633%2FhvV2PjiUVX2GpPtlU%2FWe0xxuenwYUaEZkVfHg5gJ5i6lAnAYo1DCKq0rc1%2FSg9b8O3Rns2UXiN8GWkZ8di7ZDd%2BC%2BoOM3qSV1SW1Et08gxTSSI1LifBCo%2FfrX5TwVKlB2MqgmRh1t7j1B86bww4NVeJZa3N1ub9VtSfhoJfjLXyPCiuYFTdUvGW14WhYE%2FRYzeWoCNmxkIFPs5pfApNbpnpn29RCkO6w%2FVHeRHxo%2FPaYURJNJGhQe0DGK2b0QtOO59TJJ6zljnGnXFe7qEp7VBi%2FlolJr%2BEYh0%2B%2BsspccKBsYDkptagd9%2FXltJSIApJBsLZ%2FpI5l7eUI7eesyVvPzZRhyGg5j13D4IyqGG%2B6ZEr5qLcVN%2BtqxMlzDtZ5wCNZU1Gea7nS5Hs3gEZc5qw5%2FlgcadomLFvMzzSh8Ue%2FuVVS9oEOkFt2eGl5uJcxkKw09j3RB5zCiiyNbPK5Jp%2BEdromBne2JtSX5E9bpUBLq%2B8L0pnso6bupfWKwIDCzSa8KTJ9voTykiYDBSisyPgiU1FP1AooTQoP7AbOKcmnbh0LtNb73rZ4IuxP4%2F%2BNgCN3NthesV83JOUK5%2BJJSFLZM4npkyh6jYsJIgm%2Bqu625tukpYWno2dpxkil9Uk3V36LPx3Nv5ceeoGEkZsGjQcGJJHsmv2Ov0nsJTudapX%2Bf4phWAidBDuPDBA%3D%3D')