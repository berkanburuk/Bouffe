var express = require('express');
var app = express();
var router = express.Router();

//USER
app.get('/user/:id', function (req, res, next) {
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
app.get('/user/:id/:password', function (req, res, next) {
    console.log("User and Password");
    res.end('User and Password is wrong');
    next();
});

// handler for the /user/:id path, which sends a special response
app.get('/user/:pass', function (req, res, next) {
    console.log("hee222");
    res.send('special')
});
//USER


// mount the router on the app
app.use('/', router);
app.listen(3000);
