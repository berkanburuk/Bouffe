let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSequelize;

var notifications = "";

module.exports = function (app) {

    app.get('/chef', function (request, response) {
        console.log('Chef');
        response.sendFile(path.resolve('../../public/Pages/Chef.html'));
        //res.end();

    }),

//Post - Order
        app.get('/api/:chair/:getNotification', function (request, response, next) {
            console.log(request.method);
            console.log(request.head);
            response.statusCode = 200;
            response.end(notifications + '\n' + request.body);
            next();
        })

}




