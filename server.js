var express = require('express');
var app = express();
var router = express.Router();
const portNumber = 3000;
var bodyParser = require('body-parser');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(router);


//Starting Page of The Web Application
app.get('/', function (request, response) {
    console.log('localhost:' + portNumber);
    response.sendFile(__dirname + '/public/Pages/Index.html');
});

//var appointmentServer = require('./routes/Controller/Appointment')(app);
var beverageServer = require('./routes/Controller/Beverage')(app);
var chefController = require('./routes/Controller/Chef')(app);
var foodController = require('./routes/Controller/Food')(app);
var instructorServer = require('./routes/Controller/Instructor')(app);
var menuController =  require('./routes/Controller/Menu')(app);
var orderController = require('./routes/Controller/Order')(app);
var studentServer = require('./routes/Controller/Student')(app);
var userServer = require('./routes/Controller/User')(app);
var waiterServer =require('./routes/Controller/Waiter')(app);


app.use('/', router);

// Turn on that server!
var server = app.listen(portNumber, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
