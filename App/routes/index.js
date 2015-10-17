var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TheHufts' });
});

router.get('/homepage', function(req, res, next) {
  res.render('homepage', { title: 'TheHufts' });
});

router.get('/parallax', function(req, res, next) {
  res.render('parallax', { title: 'TheHufts' });
});

module.exports = router;
