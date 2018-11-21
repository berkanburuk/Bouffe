let path = require('path');
var Order = require('../Model/Order');
var notifications = "";


module.exports = function (app) {
    app.get('/order', function (request, response) {
        console.log('Order');
        response.sendFile(path.resolve('../../public/Pages/Order.html'));
        //res.end();

    }),

//Post - Order
        app.post('/api/order', function (request, response, next) {
            var data = request.body;

            for (var key in data) {
                console.log(data[key]);
            }
            notifications = notifications + "\n" + data;
            Order.save(data);
            response.end("Order is successfully Added!");
            next();
        }),

        app.get('/api/getNotification', function (request, response,next) {
                response.end(notifications + '\n');
                next();
            })

}




