var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var SHA3       = require("crypto-js/sha3");
var session    = require('client-sessions');

var randomString = gateKeeper.randomString;

//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END

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
        var user         = {};
        user.email       = object.get('email');
        user.username    = object.get('username');
        user.accessToken = object.get('accessToken');
        user.algos       = options.algos;
        req.user         = user;
        req.session.user = user;  //refresh the session value

        var session_id = aesEncrypt(user.username, "TheHufts");
        req.session.user.session_id = session_id;

        res.locals.user  = user;
        //console.log("req.session: ", JSON.stringify(req.session));
        //console.log("req.cookies: ", JSON.stringify(req.cookies));
        // finish processing the middleware and run the route
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
  var key          = gateKeeper.gateKey;
  var confirmation = "TheHufts";
  var dataCopy     = req.body.data;
  var data         = aesDecrypt(req.body.data, key);
  data             = JSON.parse(data);
  var response     = {};

  //switching to custom user class, since parse has it's own user class already defined - problems wich are covered later.
  //use custom class name: UserC

  if(confirmation != data.confirmation){
    res.send("{error-code:k}"); //error k = key miss-match
  }
  else{ // continue with login/register route
    var requestType;
    var status;
    var response = {};

    if(data.login){ //code to log a user in
      requestType = "login";
      var TempAlgo = Parse.Object.extend("TempAlgo");
      var User     = Parse.Object.extend("UserC");
      var query    = new Parse.Query(User);
      query.equalTo( "email", data.email )//.select(userAttributes);
        query.first().then(
          function (object) {
            console.log("LOGIN: Successfully retrieved user" + object.get("username"));
            parsePwd        = object.get('pwd');
            var accessToken = object.get('accessToken');
            status          = (data.passwordhash == parsePwd );

            //setting the session to the logged in user
            if(status){
              var user          = {};
              user.accessToken  = accessToken;
              user.username     = object.get('username');
              user.email        = object.get('email');
              var relation      = object.relation("algos");
              var tempRelation  = object.relation("tempAlgos");
              var tempAlgoArray = [];//used to save temp algos
              relation.query().find().then(
                  function (list){
                    if (list.length == 0){  //the user has no uploaded algos
                      user.algos = false;
                    }
                    else{ //storing users algos in user object
                      nameList = list.map(function (algo){
                        var encryptedAlgo = algo.get("encryptedString");
                        var algoFile      = aesDecrypt(encryptedAlgo,data.password);
                        var temp          = new TempAlgo();
                        temp.set("user_id",object.id);
                        temp.set("name", algo.get("name"));
                        //accessToken to decrypt algorithms = sha3(username) -> sha3 a one way hashing algo
                        var key = sha3(user.username+"TheHufts");
                        temp.set("encryptedString", aesEncrypt(algoFile, key) );
                        temp.set("fileType",algo.get("fileType"));
                        tempAlgoArray.push(temp);
                        return { name: algo.get("name") }
                      });
                      user.algos = nameList;
                      Parse.Object.saveAll(tempAlgoArray).then(
                        //after saving tempAlgos update their relationships with user
                        function (success){
                          tempAlgoArray.forEach(function (tempAlgo){
                            console.log("saved raw tempAlgo obeject with no relationships");
                            tempRelation.add(tempAlgo)
                            //tempAlgo.set("Parent",object); //object is the returned user object
                            object.save().then(
                              function (sucess){
                                console.log("save updated  tempAlgo success");
                              },
                              function (error){
                                console.log(" line 147 error: " + error.message + " "+error.code);
                              }
                            );//end templAlgo.save.then()
                          });//end for each
                        },
                        function (error){
                          console.log("line 152 error: " + error.message + " "+error.code)
                        }
                      );
                    }
                    req.user = user;
                    req.session.user = user;  //refresh the session value
                    res.locals.user  = user;
                    var session_id = aesEncrypt(user.username, "TheHufts");
                    req.session.user.session_id = session_id;
                    response["redirect"]    = data.protocol+"//"+data.domain+"/dashboard"+ "?username="+session_id;
                    response[requestType]   = status;
                    response["accessToken"] = aesEncrypt(object.get('accessToken'),key);
                    response = JSON.stringify(response);
                    res.send(response)
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
        console.log("register data :"+JSON.stringify(data));
        var password = data.password;
        user.set("username", data.username);
        var session_id = aesEncrypt(user.username, "TheHufts");
        user.set("email", data.email);
        //using pwd as alias for password
        user.set("accessToken","TheHufts");
        user.set("pwd",password);
        user.save(null, {
          success: function(user) {
            console.log(" user successfully saved");
            var session_id = aesEncrypt(user.get("username"), "TheHufts");
            status                = true;
            response[requestType] = status;
            response["redirect"]    = data.protocol+"//"+data.domain+"/dashboard"+ "?username="+session_id;
            response              = JSON.stringify(response);

            user.email       = user.get('email');
            user.username    = user.get('username');
            user.accessToken = user.get('accessToken');

            req.user         = user;
            req.session.user = user;  //refresh the session value
            req.session.user.session_id = session_id;

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
