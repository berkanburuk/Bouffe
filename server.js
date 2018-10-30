var express = require('express');
var app = express();
var router = express.Router();
const portNumber=3000;
app.use(express.static('public'));
const path = require('path');
app.get('/', function (req, res) {
    console.log(__dirname + '/public/index.html');
    res.sendFile(__dirname + '/public/index.html');
    //res.redirect(__dirname + '/public/index.html');
    //res.end();

});


//USER
app.get('/user/', function (req, res, next) {
    // if the user ID is 0, skip to the next route
    console.log(req.method);
    //res.render('login', {title: 'Express Login'});
    if (req.params.id === 1) next('route')
    // otherwise pass the control to the next middleware function in this stack
    else {
        //var err = new Error('cannot find user ' + req.params.id);
        var err = ('cannot find user ' + req.params.id);
        err.status = 404;
        next(err);
    }
}, function (req, res, next) {
    // send a regular response
    res.send('regular')
});
//http://localhost:3000/
app.get('/user/:username/:password', function (req, res, next) {
    console.log(req.method);
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Hello' + '\n');
    next();
});

// handler for the /user/:id path, which sends a special response
app.get('/user/:pass', function (req, res, next) {
    console.log("hee222");
    res.send('special')
});
//USERhttp://localhost:63342/Bouffe/public/html_files/index.html?_ijt=9vntll50sbal4h50a3ac1f7jgh


// mount the router on the app
app.use('/', router);
app.listen(portNumber);
