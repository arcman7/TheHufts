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
        console.log("queryParseUser: Successfully retrieved " + object.get("username"));
        //console.log(object.get('pwd'));
        var user         ={};
        user.email       = object.get('email');
        user.username    = object.get('username');
        user.accessToken = object.get('accessToken');
        user.algos       = options.algos;
        req.user         = user;
        req.session.user = user;  //refresh the session value
        res.locals.user  = user;
        console.log("req.session: ", JSON.stringify(req.session));
        console.log("req.cookies: ", JSON.stringify(req.cookies));
        // finishing processing the middleware and run the route
        next();
      },
      error: function(error) {
        console.log(" queryParseUser Error: " + error.code + " " + error.message);
        // finishing processing the middleware and run the route
        next();
      }
    }); //end query.first function call
}//end queryParseUser


router.post('/', function (req, res) {
  //console.log(req.body);
  var key          = gateKeeper.gateKey;
  var confirmation = "TheHufts";
  //console.log("key: " + key);
  var dataCopy     = req.body.data;
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
    var response = {};

    if(data.login){ //code to log a user in
      requestType = "login";

      var User    = Parse.Object.extend("UserC");
      var query   = new Parse.Query(User);
      //var userAttributes = ["username","password","accessToken"];
      query.equalTo( "email", data.email )//.select(userAttributes);
        query.first().then(
          function (object) {
            console.log("LOGIN: Successfully retrieved user" + object.get("username"));
            parsePwd        = object.get('pwd');
            //console.log("parsePwd: "+parsePwd);
            //console.log("data Pwd: "+data.password);
            //deprecated from old security scheme
            //parsePwd        = aesDcrypt(parsePwd,accessToken);
            var accessToken = object.get('accessToken');
            status          = (data.passwordhash == parsePwd );
            /////////////////////////////////////////////////////
            //setting the session to the logged in user
            if(status){
              var user         = {};
              user.accessToken = accessToken;
              user.username    = object.get('username');
              user.email       = object.get('email');
              var relation     = object.relation("algos");
              relation.query().find().then(
                  function (list){
                    if (list.length == 0){  //the user has no uploaded algos
                      user.algos = false;
                    }
                    else{ //storing users algos in user object
                      list = list.map(function(algo){
                        var encryptedAlgo = algo.get("encryptedString");
                        var algoFile      = aesDcrypt(encryptedAlgo,data.password);
                        return { name: algo.get("name") }
                      });
                      user.algos = list;
                    }
                    req.user = user;
                    req.session.user = user;  //refresh the session value
                    res.locals.user  = user;
                    response["redirect"]    = "http://"+data.domain+"/dashboard"+ "?username="+user.username;
                    console.log(response["redirect"]);
                    response[requestType]   = status;
                    response["accessToken"] = aesEncrypt(object.get('accessToken'),key);
                    response = JSON.stringify(response);
                    console.log("req.session: ", JSON.stringify(req.session));
                    console.log("req.cookies: ", req.cookies);
                    console.log(response);
                    //console.log(res)
                    res.send(response)
                    //res.redirect('/dashboard');
                    //res.render('dashboard', { title: 'TheHufts' });
                  },
                  function (error){
                    console.log( "users-algos error: "+error);
                  }
                );//end relation-then function
            }//end if-status
            else{
              console.log("failed to authenticate user, incorrect password");
              status                = false;
              response[requestType] = status;
              response              = JSON.stringify(response)
              res.send(response);
            }
         },//end query user success function
         function (error) {
            console.log(" (line 133 login.js) LOGIN-Error: " + error.code + " " + error.message);
            status                = false;
            response[requestType] = status;
            response              = JSON.stringify(response)
            res.send(response);
         }); //end query-first user
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
            response              = JSON.stringify(response);
            resonse = String(response);
            res.send(response);
          }
      });/*end save function*/
    }//end register-else
  }// end else no key miss-match
});//end router post anon-function

module.exports = router;
module.exports.queryParseUser = queryParseUser;
