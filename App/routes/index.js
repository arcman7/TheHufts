var express = require('express');
var router = express.Router();

Parse.initialize("6JypJXIdsGTnplYK7PJyFzOk6GsgJllAH2tiLdjA", "zOuAg8TeFShTPRd0SMq6YkDS3CWTQktdYkE2O5Fm");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;
