var express = require('express');
var app = new express();
var router = express.Router();
const portNumber = 3000;
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));



//var appointmentServer = require('./routes/Controller/Appointment')(app);
//var reservationServer = require('./routes/Controller/Reservation')(app);
var userServer = require('./routes/Controller/User')(app);
//var beverageServer = require('./routes/Controller/Beverage')(app);
//var foodController = require('./routes/Controller/Food')(app);
//var menuController =  require('./routes/Controller/Menu')(app);
//var orderController = require('./routes/Controller/Order')(app);
//var tableServer = require('./routes/Controller/Table')(app);



app.use('/', router);

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

function getRouter(){
    return app;
}

module.exports = {
    getRouter
}
