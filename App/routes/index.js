var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TheHufts' });
});

router.get('/homepage', function(req, res, next) {
  res.render('homepage', { title: 'TheHufts' });
});

router.get('/landingPage', function(req, res, next) {
  res.render('landingPage', { title: 'TheHufts' });
});

module.exports = router;
