let path = require('path');
var Menu = require('../Model/Menu');

module.exports = function (app) {

    app.get('/menu', function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/Menu.html'));

    }),
        app.post('/api/:addMenu/', function (request, response, next) {
            var data = request.body;
            console.log('asdas');
            console.log
            response.end('Successfully Added');
            next();
        })
}
