var express    = require('express');
var router     = express.Router();
var CryptoJS   = require("crypto-js");
var gateKeeper = require('./gateKeeper');
var Parse      = require('parse/node');
var AES        = require("crypto-js/aes");
var SHA256     = require("crypto-js/sha256");
var SHA3       = require("crypto-js/sha3");
var session    = require('client-sessions');

//Parse initialization
var parseSecret1 = "6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA";
var parseSecret2 = "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm";
Parse.initialize(parseSecret1, parseSecret2);
//Parse initalization END

router.post('/', function (req, res) {
  console.log("lougout route:")
  console.log(req.body.user);
  var TempAlgo = Parse.Object.extend("TempAlgo");
  var User     = Parse.Object.extend("UserC");
  var query    = new Parse.Query(User);
  query.equalTo( "email", data.email )//.select(userAttributes);
  query.first().then(
    function (object) {
      //var relation      = object.relation("algos");
      //var tempAlgoArray = [];//used to save temp algos
      var tempRelation  = object.relation("tempAlgos");
      tempRelation.query().find().then(
        function (list){
          if(list.length > 0){
            Parse.Object.destroyAll([object1, object2, object3]).then(
              function (success) {
              // All the objects were deleted
              req.user = req.session.user = res.locals.user = null;
              var response = {redirect: "http://"+req.body.domain+"/landingPage"};
              response = JSON.stringify(response);
              res.send(response);
              },
              function (error) {
                console.error("Oops! Something went wrong: " + error.message + " (" + error.code + ")");
                res.send("logout error");
              }
            );//end Parse.object.destoryALL
          }//end if
        },//end list success
        function (error){
          console.log("logout line 42, error:");
          console.log(error);
          //tempRelation query error
        }//end list error
      )//end tempRelation.query().then()
    },
    function (error)  {
      console.log("lout line 47, error:");
      console.log(error)
      //object user query error
     }
    );//end object .then()
   //log user out
});//end post function

module.exports = router;