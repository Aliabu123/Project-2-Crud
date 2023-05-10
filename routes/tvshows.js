var express = require('express');
var router = express.Router();

const tvshowController = require('../controllers/tvshowController.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('searchPage.ejs');
});

{/* <form action="/tvshowSearch" methods="POST"></form> */}


router.post('/tvshowSearch', tvshowController.fetchTvShowsList )

module.exports = router;
