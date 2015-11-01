var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session){
    console.log(req);
    console.log("its a thing");
  }
  //console.log(req.session);
  res.render('index', { title: 'TheHufts' });
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

module.exports = router;
