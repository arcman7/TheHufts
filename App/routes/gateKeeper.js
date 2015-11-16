
//function yieldKey(antiCachingArgument){
  var express = require('express');
  var router = express.Router();

function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
}

 function determineKey(){
   var currentMin = new Date().getMinutes();
   if( module.exports.currentMin == currentMin){
       return (module.exports.gateKey);
    }
   else{
      module.exports.currentMin = currentMin;
      module.exports.gateKey = randomString(77,"aA#!");
      return (module.exports.gateKey);
   }
 }
  router.get('/knockKnock', function(req, res, next) {
    var currentMin = new Date().getMinutes();
    res.send(determineKey());
  });
//}
module.exports = router;
//module.exports = yieldKey;
module.exports.currentMin = new Date().getMinutes();
module.exports.gateKey = randomString(77,"aA#!");
module.exports.randomString = randomString;

