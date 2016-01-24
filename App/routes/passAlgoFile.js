var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var SHA3       = require("crypto-js/sha3");
var session    = require('client-sessions');

//Encryption-Decryption functions
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
//Encryption-Decryption END

//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END

router.post('/', function (req, res, next)
  {
    var data = req.body;
    var User     = Parse.Object.extend("UserC");
    var query    = new Parse.Query(User);
    var username = aesDecrypt(data.username, "TheHufts");
    query.equalTo( "username", username );
    query.first().then(
    function (object) {

      var tempRelation  = object.relation("tempAlgos");
      tempRelation.query().find().then(
        function (list){
          list.every(function (algo){

            if(algo.get("name") == data.algoName){
              var accessToken = object.get("accessToken");
              var encryptedAlgo = algo.get("encryptedString");

              var key = sha3(username+"TheHufts");
              //console.log(encryptedAlgo,key)

              //decrypt file
              var algoFile = aesDecrypt(encryptedAlgo,key);
              //console.log(algoFile);
              //console.log(JSON.stringify(object))
              //console.log(accessKey);
              //encrypt file for browser
              var browserEncryptedAlgo = aesEncrypt(algoFile,accessToken);
              console.log(browserEncryptedAlgo);
              //good to go
              var response = {algoFile: browserEncryptedAlgo, fileType: algo.get("fileType")};
              response = JSON.stringify(response);
              res.send(response);
              return false;
            }
            return true
          });//end foreach

        },//end list success
        function (error){
          console.log("passAlgoFile line 58, error:");
          console.log(error);
          res.send("could not find users algos");
          //tempRelation query error
        }//end list error
      )//end tempRelation.query().then()
    },
    function (error)  {
      console.log("passAlgoFile could not find user: ");
      console.log(error);
      res.send("could not find user")
      //object user query error
     }
    );//end object .then()
  }
); //end router post
module.exports = router;