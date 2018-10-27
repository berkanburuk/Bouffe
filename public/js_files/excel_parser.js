/*var express    = require('express');
var app        = express();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: true});

app.use(express.static('public'));

var apis = require('./routes/apis');
app.use('/', apis);

module.exports = app;
*/

var router = require('express').Router();
router.post('localhost/c_user.js',function(req,res,next){
    //your code
})

module.exports = router