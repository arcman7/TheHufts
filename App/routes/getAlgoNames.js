var express = require('express');
var router = express.Router();

function resetSessionAlgos(username,req,res){
  //only
   var User  = Parse.Object.extend("UserC");
   var query = new Parse.Query(User);
    query.equalTo( "username", username )//.select(userAttributes);
    query.first().then(
      function (object) {
        console.log("LOGIN: Successfully retrieved user" + object.get("username"));

        var accessToken = object.get('accessToken');
        /////////////////////////////////////////////////////
        //setting the session to the logged in user
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
                  return {algo: algoFile, name: algo.get("name") }
                });
                user.algos = list;
              }
              req.user = user;
              req.session.user = user;  //refresh the session value
              res.locals.user  = user;
              response[requestType]   = status;
              response["accessToken"] = aesEncrypt(object.get('accessToken'),key);
              response = JSON.stringify(response);
              console.log("req.session: ", JSON.stringify(req.session));
              console.log("req.cookies: ", req.cookies);
              //res.send(response)
            },
            function (error){
              console.log( "users-algos error: "+error);
            }
          );//end relation-then function
      },//end query user success function
      function (error) {
        console.log(" (line 205 app.js) LOGIN-Error: " + error.code + " " + error.message);
        status                = false;
        response[requestType] = status;
        response              = JSON.stringify(response)
        res.send(response);
      }
    ); //end query-first user
}
router.post('/', function(req, res, next) {
  //has the effect of setting the session again, including assignment of the users algorithms
    resetSessionAlgos(req.body.data.username,req,res)
    if(req.path == "/getAlgoNames"){
      var response = {};
      response["names"] = [];
      //console.log("req.session: " + JSON.stringify(req.session));
      //console.log(req.body);
      getAlgos()
      var list = req.session.user.algos;
      if (list.length == 0){  //the user has no uploaded algos
        response["names"] = false;
      }
      else{
        list.forEach(function(algo){
           response["names"].push(algo.name);
        });
      }
      response = JSON.stringify(response);
      res.send(response);
    }
});

module.exports = router;
module.exports.resetSessionAlgos = resetSessionAlgos;
