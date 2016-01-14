var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landingPage', { title: 'TheHufts', user: req.session.user });
});

router.get('/landingPage', function(req, res, next) {
  res.render('landingPage', { title: 'TheHufts', user: req.session.user });
});

router.get('/logIn', function(req, res, next) {
  res.render('logIn', { title: 'TheHufts', user: req.session.user });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'TheHufts', user: req.session.user });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'TheHufts', user: req.session.user });
});

router.get('/subscription', function(req, res, next) {
  res.render('subscription', { title: 'TheHufts', user: req.session.user });
});

module.exports = router;
