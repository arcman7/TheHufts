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



router.post('/', function (req, res) {
// Declare the types.
var User = Parse.Object.extend("UserC");
var Algo = Parse.Object.extend("Algo");
var TempAlgo = Parse.Object.extend("TempAlgo");

var response = {};

var userAlgoSave = function (options,response) {//this function assumes userAlgo is an already existing global variable
  console.log("hi from userAlgoSave");
   var User           = Parse.Object.extend("UserC");
   var query          = new Parse.Query(User);

   query.equalTo( "email", options.email );
   return query.first().then(function (user) {
        var user_id = user.id;
        console.log("user_id: " + user_id);
        console.log("Successfully retrieved user " + user.get("username"));
        response["userFound"] = true;

        var relation = user.relation("algos");
        relation.add(userAlgo);  //assumes the objet must be saved first before adding relationships

        userAlgo.set("Parent",user);
        userAlgo.set("user_id",user_id);

        var tempRelation  = user.relation("tempAlgos");
        tempRelation.add(temp);

        var key = sha3(user.get("username")+"TheHufts");
        temp.set("user_id",user_id);
        console.log("saveAlgo key: ", key);
        //create decrypted copy
        var algoFile = aesDecrypt(data.algo, data.password);
        console.log("    algoFile: ", algoFile);
        console.log(" encryptedAlgoFile: ", aesEncrypt(algoFile, key) );
        //set temp with encrpted Algo using key "key"
        temp.set("encryptedString", aesEncrypt(algoFile, key) );

        //var response2 = userAlgo.save().then(
        Parse.Object.saveAll([userAlgo,temp]).then(
          function (success){
            console.log("Successfully saved user " + user.get("username") + " with algo: "+ userAlgo.get("name"));
            req.session.user.algos.push({name: data.name});
            console.log("saveAlgo req.session.user.algos: ",req.session.user.algos);
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
var requestType  = "saveAlgoCloud";
var userAlgo     = new Algo();

var key          = gateKeeper.gateKey;
var confirmation = "TheHufts";
var data         = aesDecrypt(req.body.data, key);
data             = JSON.parse(data);

if(confirmation != data.confirmation){
  res.send("{error-code:k}"); //error k = key miss-match
}
else{ // continue with login/register route
  var requestType;
  var status;
  console.log(data.name);
  userAlgo.set("name", data.name);
  userAlgo.set("encryptedString", data.algo);
  userAlgo.set("fileType",data.fileType);

  var temp         = new TempAlgo();
  temp.set("name", data.name);
  temp.set("fileType",data.fileType);

  Parse.Object.saveAll([userAlgo,temp]).then(
    function (success){
        console.log(" userAlgo  and temp algo successfully saved");
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
  );//end parse.saveAll
}//end else

}); //end router post anon-function
module.exports = router;
