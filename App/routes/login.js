var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");

var AES = require("crypto-js/aes");
function aesDcrypt(string,key){
  var decrypted = AES.decrypt(string, key);
  var decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
  return decryptedString;
}

router.post('/login', function (req, res) {
  //console.log(req.body);
  var encrypted = req.body.encrypted;
  console.log("encrypted: " + encrypted);

 var key = req.body.key;
  console.log("key: " + key);

  // var decrypted = AES.decrypt(req.body.encrypted, req.body.key, { format: JsonFormatter });
  var message = aesDcrypt(encrypted,key);
  console.log(message);
  //console.log(decrypted);
  //var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase", { format: JsonFormatter });
  console.log("gateKey: " + module.exports.gateKey);
  //var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
  res.send('you used key: '+ key + " and the message is " + message);

});

module.exports = router;
