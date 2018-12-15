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

let sessionOptions = {
    /*genid: function(req) {
        return genuuid() // use UUIDs for session IDs
    },*/
    secret: "keyboard",
    cookie: {
        maxAge:777777777
        //expires: 3600
    },
    saveUninitialized: true,
    resave:true,

};
app.use(cookieParser());
app.use(session(sessionOptions));


//Starting Page of The Web Application
app.get('/', function (request, response)  {
    if (request.session.roleId == undefined){
        response.sendFile(path.resolve('public/Pages/Login.html'));
    }else{
        response.sendFile(path.resolve('public/Pages/Navigation.html'));
    }
});


var reservationServer = require('./routes/Controller/Reservation')(app,session);
console.log("reservationServer "+reservationServer);
var userServer = require('./routes/Controller/User')(app);
var tableServer = require('./routes/Controller/Table')(app);
var guestCheck = require('./routes/Controller/GuestCheck')(app);
var beverageServer = require('./routes/Controller/Beverage')(app);
var foodController = require('./routes/Controller/Food')(app);
var menuController =  require('./routes/Controller/Menu')(app);
var orderController = require('./routes/Controller/Order')(app);
var errorController = require('./routes/Controller/Error')(app);

app.use('/', router);
// Turn on that server!
var server = app.listen(portNumber, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})





