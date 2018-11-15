var express = require('express');
var app = express();
var router = express.Router();
const portNumber = 3000;
var bodyParser = require('body-parser');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));



var user = require('./routes/Controller/User')(app);
var createMenu = require('./routes/Controller/Menu')(app);
var order = require('./routes/Controller/Order')(app);
var instructor = require('./routes/Controller/Instructor')(app);
var chef = require('./routes/Controller/Chef')(app);


//Starting Page of The Web Application
app.get('/', function (request, response) {
    console.log('localhost:' + portNumber);
    response.sendFile(__dirname + '/public/Pages/Index.html');
});

app.use('/', router);

// Turn on that server!
var server = app.listen(portNumber, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
