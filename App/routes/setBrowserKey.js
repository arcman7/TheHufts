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

var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);


router.post('/', function (req, res, next)
  {
    var data = req.body;
    var User     = Parse.Object.extend("UserC");
    var query    = new Parse.Query(User);
    var username = aesDecrypt(data.username, "TheHufts");
    var response = {}; requestType = "setUserAcessToken";

    query.equalTo( "username", username );
    query.first().then(
      function (object) {
        object.set("accessToken",data.browserKey);
        object.save(null, {
          success: function(user) {
            console.log(" user successfully saved new accessToken");
            response[requestType] = true;
            response = JSON.stringify(response);
            res.send(response);
          },
          error: function(user, error) {
            console.log("failed to save user accessToken " + error.message)
            response[requestType] = false;
            response              = JSON.stringify(response);
            res.send(response);
          }
      });/*end save function*/
      },
      function (error)  {
        console.log("setBrowserKeylout line 65, error:");
        console.log(error)
        res.send("broswerKey set-up: Could not find user");
        //object user query error
       }
      );//end object .then()
  }
); //end router post
module.exports = router;