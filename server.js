var http = require('http')
var finalhandler = require('finalhandler')
var express = require('express');
// create the router and server
var router = express.Router();


var server = http.createServer(function onRequest(req, res) {
    router(req, res, finalhandler(req, res))
})

router.get('/', function(req, res, next) {
    res.render('hey this worked');
});
router.get('/another/route', function(req, res, next) {
    res.json({ hello: 'world' });
});


/*

// register a route and add all methods
router.route('/server/:id')
    .get(function (req, res) {
        // this is GET /pet/:id
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'hello' }))
    })
    .delete(function (req, res) {
        // this is DELETE /pet/:id
        res.end()
    })
    .all(function (req, res) {
        // this is called for all other methods not
        // defined above for /pet/:id
        res.statusCode = 405
        res.end()
    })
*/
// make our http server listen to connections
server.listen(8080);

module.exports = router;

/*
const url = require('url');
const http = require('http');
const app1 = http.createServer(function(request, response) {

var query = url.parse(request.url, true).query;
console.log(query);
response.writeHead(200, {"Content-Type": "text/html"});
response.write('&lt;h1&gt;The city you are in is ${city}.&lt;/h1&gt;');
response.end();
});
app1.listen(3000);
*/