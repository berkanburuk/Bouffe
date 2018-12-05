let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mOrder = db.model(dbNames.order);

//0 -> default Value(Just Ordered)
//1 -> if chef notification, if waiter notification
//3 -> done
//4 -> reject

function createAnBeverageOrder(data){

    return new Promise((resolve, reject) => {
        mOrder.findOrCreate({
            where:
                {
                    id: data.id
                },
            defaults:
                {
                    date: data.date,
                    note: data.note,
                    isPaid: data.isPaid,
                    isFoodReady: 0,
                    isBeverageReady: 0
                }
        }).then((order)=>{
            console.log(order[0].get(0));
            order[0].addBeverages(data.roleId);

            resolve("Beverage ordered successfully.");
        })
            .catch(error =>{
                reject("Beverage could not be ordered!" + error);
            })

    })

}



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

        app.post('/api/:order/:orderBeverage', function (request, response,next) {
            var data = request.body;
            createAnBeverageOrder(data).then(beverage=>{
                response.end(beverage);
            }).catch(error=>{
                response.end(error);
            })
            next();
        }),


        app.get('/api/:order/:getNotification', function (request, response,next) {
                response.end(notifications + '\n');
                next();
            }),

    app.get('/api/:order/:getAllOrders', function (req, res, next) {
        ordersController.findAll({ raw: true }).then(result =>{
            console.log(result);
            res.end(result);
        })

        next();
    })


}




