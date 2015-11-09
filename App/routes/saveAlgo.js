var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var session = require('client-sessions');


//Encryption-Decryption functions
function aesDcrypt(string,key){
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
//Encryption-Decryption END



router.post('/', function (req, res) {
// Declare the types.
var User = Parse.Object.extend("UserC");
var Algo = Parse.Object.extend("Algo");

var response = {};

var userAlgoSave = function (options,response) {
  console.log("hi from userAlgoSave");
   var User           = Parse.Object.extend("UserC");
   var query          = new Parse.Query(User);

   query.equalTo( "email", options.email );
   return query.first().then(function (user) {
        var user_id = user.id;
        console.log("user_id: " + user_id);
        console.log("Successfully retrieved user " + user.get("username"));
        response["userFound"] = true;
        //var relation = user.relation("algos");
        //relation.add(userAlgo);
        userAlgo.set("Parent",user);
        userAlgo.set("user_id",user_id);
        //user.save().then(
        var response2 = userAlgo.save().then(
          function (algo){
            console.log("Successfully saved user " + user.get("username") + " with algo: "+ algo.get("name"));
            response["userSaveAlgo"] = true;
            response = JSON.stringify(response);
            //console.log(response);
            res.send(response);
            return ;
          },
          function (error){
            response["userSaveAlgo"] = false;
            console.log("Error: " + error.code + " " + error.message);
            //res.send(response);
            return ;
          }
        );//end user-update-save function.then
        //res.send(response);
      },
     function (error) {
        console.log("Error: " + error.code + " " + error.message);
        response["userFound"] = false;
        //res.send(response);
      }
    ); //end query.first function call
}//end queryParseUser

// Create the user's algo
var userAlgo = new Algo();
var requestType = "saveAlgoCloud";
console.log(req.body.name);
userAlgo.set("name", req.body.name);
userAlgo.set("encryptedString", req.body.algo);


  userAlgo.save().then(
      function (algo){
        console.log(" algo successfully saved")
        status                = true;
        response[requestType] = status;
        var userC = req.session.user;
        console.log("userC: " + userC.email);
        userAlgoSave(userC,response)
      },
      function (error) {
        console.log("failed to save algo" + error.message)
        status                = false;
        response[requestType] = status;
        res.send(response);
      }
  );

}); //end router post anon-function
module.exports = router;
