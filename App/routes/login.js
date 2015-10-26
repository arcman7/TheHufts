var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");

//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END

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

router.post('/login', function (req, res) {

  console.log(req.body);
  var key          = gateKeeper.gateKey;
  var confirmation = "TheHufts";
  var data         = aesDcrypt(req.body.data, key);
  console.log(data)
  data             = JSON.parse(data);
  //switching to custom user class, since parse has it's own user class already defined.
  //use class name: UserC

  //console.log("decrypted confirmation: "+data.confirmation);

  if(confirmation != data.confirmation){
    res.send("{error-code:k}"); //error k = key miss-match
  }
  else{ // continue with login/register route
    var requestType;
    var status;
    if(data.login){ //code to log a user in

      var User           = Parse.Object.extend("UserC");
      var query          = new Parse.Query(User);
      var userAttributes = ["username","password","accessToken"];
      query.equalTo( "username", data.username )//.select(userAttributes);
        query.first({
          success: function(object) {
            console.log("Successfully retrieved " + object);
            // Do something with the returned Parse.Object values
            //console.log(object.id + ' - ' + object.get('username'));
            //console.log("encrypted password from Parse: " + object.get('password'));
            //var parsePwd = object.get('password').toString();
            //console.log("decrypted: " + aesDcrypt(parsePwd,key));
            parsePwd        = object.get('pwd');
            var accessToken = object.get('accessToken');
            parsePwd        = aesDcrypt(parsePwd,accessToken);
            status          = (data.password == parsePwd );
            var response    = {};

            response[requestType]   = status;
            response["accessToken"] = aesEncrypt(object.get('accessToken'),key);
            response                = JSON.stringify(response)
            res.send(response);
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            status                = false;
            var response          = {};
            response[requestType] = status;
            response              = JSON.stringify(response)
            res.send(response);
          }
        });
        // Parse.User.logIn(data.username, data.password, {
        //     success: function(results)
        //     {
        //         //response.success(true);
        //       console.log(results);
        //       status = true;
        //       var response = {};
        //       response[requestType] = status;
        //       response = JSON.stringify(response)
        //       res.send(response);
        //     },
        //     error: function(user,error) {
        //         //response.success(false);
        //       //the user in the scope of the error function is a (new User) that is created temorarily - instantiated
        //       status = false;
        //       console.log("Error: ");
        //       console.log(error + ", " +error.message);
        //       console.log("user retrieved: ");
        //       console.log("password: "+user.get("password"), "username: "+user.get("username"));
        //       console.log("credentials: "+data.username + " " + data.password);
        //       var response = {};
        //       response[requestType] = status;
        //       response = JSON.stringify(response)
        //       res.send(response);
        //     }
        // });
      requestType = "login";
    }//end if - login
    else{ //code to register a user
      requestType  = "register";
      var User     = Parse.Object.extend("UserC");
      var user     = new User();
      var password = aesEncrypt(data.password,"TheHufts");
      console.log("password: " + password);
      user.set("username", data.username);
      user.set("email", data.email);
      //user.set("password",password); goddamn parse wont let us access passwords or use the User class to login
      //using pwd as alias for password
      user.set("accessToken","TheHufts");
      user.set("pwd",aesEncrypt(data.password,"TheHufts"));
      user.save(null, {
        success: function(user) {
          console.log(" user successfully saved")
          status                = true;
          var response          = {};
          response[requestType] = status;
          response              = JSON.stringify(response)
          res.send(response);
        },
        error: function(user, error) {
          console.log("failed to save " + error.message)
          status                = false;
          var response          = {};
          response[requestType] = status;
          response              = JSON.stringify(response)
          res.send(response);
        }
     });/*end save function*/
    }//end register-else
  }// end else no key miss-match
});//end router post anon-function

module.exports = router;
