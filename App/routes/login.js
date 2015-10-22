var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');

//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END


var AES = require("crypto-js/aes");
function aesDcrypt(string,key){
  var decrypted = AES.decrypt(string, key);
  var decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
  return decryptedString;
}

function aesEncrypt(string,key){
  var encrypted = AES.encrypt(string,key);
  var encryptedString = CryptoJS.enc.Utf8.stringify(encrypted);
  return encryptedString;
}

router.post('/login', function (req, res) {
  //var encrypted = req.body.encrypted;
  //console.log("encrypted: " + encrypted);
  console.log(req.body);
  var key = gateKeeper.gateKey;
  var confirmation = "TheHufts";
  var data = aesDcrypt(req.body.data, key);
  console.log(data)
  data = JSON.parse(data);


  //console.log("decrypted confirmation: "+data.confirmation);

  if(confirmation != data.confirmation){
    res.send("{error-code:k}"); //error k = key miss-match
  }
  else{
    var requestType;
    var myId = "xbPnBwRQus";
    if(data.login){ //code to log a user in
      var query = new Parse.Query("User");
      query.get(myId, {
         success: function(object) {
          // object is an instance of Parse.Object.
           console.log(object)
         },
         error: function(object, error) {
          // error is an instance of Parse.Error.
         }
      });
      requestType = "login";
    }
    else{ //code to register a user
      var User = Parse.Object.extend("User");
      // var Algo = Parse.Object.extend("Algo");
      // var algo = new Algo();
      var user = new User();
      var password = aesEncrypt(data.password,"TheHufts");

      user.set("username", data.username);
      user.set("email", data.email);
      user.set("password",password);
      user.set("token","TheHufts");
      var status;
      user.save(null, {
            success: function(user) {
              console.log(" user successfully saved")
              satus = true;
            },
            error: function(user, error) {
              console.log("failed to save")
              satus = false;
            }
         });/*end save function*/

      requestType = "register";
    }//end register-else
    var response = {requestType: status}

    res.send(JSON.stringify(response));
    //console.log("gateKey: " + module.exports.gateKey);
    //res.send('you used key: '+ key + " and the message is " + data.username);
  }

});//end router post anon-function

module.exports = router;
