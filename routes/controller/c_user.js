const url = require('url');
const http = require('http');
const app1 = http.createServer(function(request, response) {

    var query = url.parse(request.url, true).query;
    console.log(query);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write('ola');
    response.end();
});
app1.listen(3000);
