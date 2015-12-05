var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landingPage', { title: 'TheHufts' });
});

router.get('/landingPage', function(req, res, next) {
  res.render('landingPage', { title: 'TheHufts' });
});

router.get('/logIn', function(req, res, next) {
  res.render('logIn', { title: 'TheHufts' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'TheHufts' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'TheHufts' });
});

router.get('/subscription', function(req, res, next) {
  res.render('subscription', { title: 'TheHufts' });
});

module.exports = router;
