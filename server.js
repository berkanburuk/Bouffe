var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const uuid = require('uuid/v4');
//const FileStore = require('session-file-store')(session);
let path = require('path');
var app = new express();
app.set('trust proxy', 1)
var router = express.Router();
const RedisStore = require('connect-redis')(session);

const portNumber = 3000;
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
// initialize cookie-parser to allow us access the cookies stored in the browser.
var currentSessionInfo="keyboard";

let sessionOptions = {
    /*genid: function(req) {
        return genuuid() // use UUIDs for session IDs
    },*/
    secret: currentSessionInfo,
    cookie: {
        maxAge:3600
        //expires: 3600
    },
    saveUninitialized: true,
    resave:true
};
app.use(session(sessionOptions));
app.use(cookieParser());

var reservationServer = require('./routes/Controller/Reservation')(app,session);
console.log("reservationServer "+reservationServer);
var userServer = require('./routes/Controller/User')(app);
var tableServer = require('./routes/Controller/Table')(app,session);
var guestCheck = require('./routes/Controller/GuestCheck')(app,session);
//var beverageServer = require('./routes/Controller/Beverage')(app,session);
var foodController = require('./routes/Controller/Food')(app,session);
var menuController =  require('./routes/Controller/Menu')(app,session);
var orderController = require('./routes/Controller/Order')(app,session);



// initialize express-session to allow us track the logged-in user across sessions.


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    console.log("sessionChecker");
    console.log(req.session.username);
    console.log(req.cookies.roleId);
    if (req.session.username == undefined){
        res.sendFile(__dirname + '/public/Pages/Login.html');
    }else{
        res.sendFile(__dirname + '/public/Pages/Index.html');
    }

};
//Starting Page of The Web Application
// route for Home-Page
app.get('/', sessionChecker, (request, response) => {
    console.log("sessionChecker function çağırma");
    response.sendFile(__dirname + '/public/Pages/Index.html');
});




app.use('/', router);
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use(function (request, response, next) {
    console.log("ilk " +request.session.username);
    response.setHeader('Content-Type', 'application/json' );
    if (request.cookies.user_sid && !request.session.username) {
        response.clearCookie('user_sid');
    }
    next()
})




/*
app.get('*', function(req, res) {
    if (req.session.username == undefined){
        res.sendFile(__dirname + '/public/Pages/Login.html');

    }else{
        res.sendFile(__dirname + '/public/Pages/Index.html');
    }
});
*/
//Starting Page of The Web Application
app.get('/', function (request, response) {
    console.log('localhost:' + portNumber);
    response.sendFile(__dirname + '/public/Pages/Index.html');
});


// Turn on that server!
var server = app.listen(portNumber, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('views',__dirname+'/Pages');
app.set('views','public/Pages');
function getRouter(){
    return app;
}
module.exports = function() {
    isWaiter(param)
};



