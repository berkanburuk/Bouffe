var express = require('express');
var app = express();
var router = express.Router();
var user = require('./routes/Controller/User')(app);
var createMenu = require('./routes/Controller/Menu')(app);

const portNumber=3000;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//Starting Page of The Web Application
app.get('/', function (req, res) {
    console.log('localhost:'+portNumber);
    res.sendFile(__dirname + '/public/html_files/index.html');
    //res.end();

});


/*
//User Request
app.post('/api/user/', function (request, response,next) {
    var data = request.body;
    for (var key in data){
        console.log(data[key]);
    }
    response.end('Successfully Login');
    next();
})

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
*/
/*
app.route('/api/user/')
    .get(function(req, res) {
        console.log('user');
        res.send('user' + '\n');
        //var err = ('cannot find user ' + req.params.id);
        //err.status = 404;
        //next(err);
    })
    .post(function(req, res) {
        res.send('Add a book');
    })
    .put(function(req, res) {
        res.send('Update the book');
    });
*/
//Get Menu Page



//  Connect all our routes to our application


app.use('/', router);

// Turn on that server!


var server = app.listen(portNumber, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
    console.log('App listening on port 3000');
})
