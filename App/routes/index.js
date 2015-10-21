var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TheHufts' });
});

router.get('/landingPage', function(req, res, next) {
  res.render('landingPage', { title: 'TheHufts' });
});

router.get('/logIn', function(req, res, next) {
  res.render('logIn', { title: 'TheHufts' });
});

router.get('/signUp', function(req, res, next) {
  res.render('signUp', { title: 'TheHufts' });
});
module.exports = router;
