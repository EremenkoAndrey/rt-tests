var express = require('express');
var router = express.Router();
var tests = require('../index');
var status = 'pending';
const colors = require('colors');
const urls = require('./../urls');
const saveLinks = require('./../saveLinks');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { status: status });
});

router.post('/', function (req, res, next) {

  if(req.body.clear) {
    tests.clear().then(function () {
      status = 'pending';
      res.render('index', { status: status });
    })

  } else {

    status = 'process';
    tests.start(req.body, function (err) {

      if(err){
        console.log(colors.red('Возникли ошибки при проверке'));
        status = 'rejected';
      } else {
        var jsonLinksObj = JSON.stringify(urls.getHash());
        saveLinks(jsonLinksObj);

        status = 'fulfilled';
      }
    });
    res.redirect('/');
  }

});

module.exports = router;
