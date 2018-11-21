let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSeq;
var notifications = "";

function getUsers(ordersController) {
    var d;
    ordersController.findAll({ raw: true }).then(result =>{
        d=result;
    })
    return d;
}

module.exports = function (app) {
    var s = sequelize();
    var ordersController = s.model("order");

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
            }),

    app.get('/api/:getAllOrders', function (req, res, next) {
        ordersController.findAll({ raw: true }).then(result =>{
            console.log(result);
            res.end(result);
        })

        next();
    })


}




