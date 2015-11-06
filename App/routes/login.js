var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var session = require('client-sessions');


//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END

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

//this function is made for use in context of middle where with access to the next parameter in app.use(function(req, res, next) { }
function queryParseUser(options,req,res,next) {
  console.log("hi from queryParseUser")
   var User           = Parse.Object.extend("UserC");
   var query          = new Parse.Query(User);
   query.equalTo( "email", options.email );
    query.first({
      success: function(object) {
        console.log("Successfully retrieved " + object);
        console.log(object.get('pwd'));
        var user ={};
        user.email = object.get('email');
        user.username = object.get('username');
        user.accessToken = object.get('accessToken');
        req.user = user;
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
        // finishing processing the middleware and run the route
        next();
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
        // finishing processing the middleware and run the route
        next();
      }
    }); //end query.first function call
}//end queryParseUser


router.post('/login', function (req, res) {
  var key          = gateKeeper.gateKey;
  var confirmation = "TheHufts";
  var data         = aesDcrypt(req.body.data, key);
  data             = JSON.parse(data);
  var response     = {};

  //switching to custom user class, since parse has it's own user class already defined - problems wich are covered later.
  //use custom fclass name: UserC

  if(confirmation != data.confirmation){
    res.send("{error-code:k}"); //error k = key miss-match
  }
  else{ // continue with login/register route
    var requestType;
    var status;
    if(data.login){ //code to log a user in
      requestType = "login";

      var User           = Parse.Object.extend("UserC");
      var query          = new Parse.Query(User);
      var userAttributes = ["username","password","accessToken"];
      query.equalTo( "email", data.email )//.select(userAttributes);
        query.first({
          success: function(object) {
            console.log("Successfully retrieved " + object);

            parsePwd        = object.get('pwd');
            console.log("parsePwd: "+parsePwd);
            console.log("data Pwd: "+data.password);
            var accessToken = object.get('accessToken');
            //deprecated from old security scheme
            //parsePwd        = aesDcrypt(parsePwd,accessToken);
            status          = (data.password == parsePwd );
            /////////////////////////////////////////////////////
            //setting the session to the logged in user
            if(status){
              var user         = {};
              user.accessToken = accessToken;
              user.username    = object.get('username');
              user.email       = object.get('email');
              req.session.user = user;
               console.log("inside login post route");
               console.log("req.session: ", JSON.stringify(req.session));
               console.log("req.cookies: ", JSON.stringify(req.cookies));
              response["redirect"]  = "http://localhost:3000/dashboard";
            }
            //end session if-statement
            /////////////////////////////////////////////////////
            response[requestType]   = status;
            response["accessToken"] = aesEncrypt(object.get('accessToken'),key);
            response                = JSON.stringify(response);
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

    }//end if - login
    else{ //code to register a user
      requestType  = "register";
      var User     = Parse.Object.extend("UserC");
      var user     = new User();
      console.log("data :"+JSON.stringify(data));
      var password = data.password; //aesEncrypt(data.password,"TheHufts");
      //console.log("password: " + password);
      user.set("username", data.username);
      user.set("email", data.email);
      //user.set("password",password);  parse wont let us access passwords or use the User class to login
      //using pwd as alias for password
      user.set("accessToken","TheHufts");
      //deprecated password storage scheme:
      //user.set("pwd",aesEncrypt(data.password,"TheHufts"));
      user.set("pwd",password);
      user.save(null, {
        success: function(user) {
          console.log(" user successfully saved")
          status                = true;
          response[requestType] = status;
          respones["redirect"]  = "http://localhost:3000/dashboard";
          response              = JSON.stringify(response);

          user.email       = user.get('email');
          user.username    = user.get('username');
          user.accessToken = user.get('accessToken');

          req.user         = user;
          req.session.user = user;  //refresh the session value
          res.locals.user  = user;
        // finishing processing the middleware and run the route
          res.send(response);
        },
        error: function(user, error) {
          console.log("failed to save " + error.message)
          status                = false;
          response[requestType] = status;
          response              = JSON.stringify(response)
          res.send(response);
        }
     });/*end save function*/
    }//end register-else
  }// end else no key miss-match
});//end router post anon-function

module.exports = router;
module.exports.queryParseUser = queryParseUser;
