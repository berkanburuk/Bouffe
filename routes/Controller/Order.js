let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let isTableExist = require('./Table').isTableExists;
let getMenusFood = require('./Menu').getMenusFood;
let getAllFeaturesOfFood = require('./Food').getAllFeaturesOfFood;
let isPaymentExists = require('./Payment').isExists;
//let getABeverage = require('./Beverage').getABeverage;
let db = sequelize();
let dbNames = tableNames();
let mOrder = db.model(dbNames.order);
let mPayment = db.model(dbNames.payment);
let mMenuFood = db.model(dbNames.menuFood);
let mBeverage = db.model(dbNames.beverage);
let mTable = db.model(dbNames.table);
let mMenu = db.model(dbNames.menu);
let mFood = db.model(dbNames.menu);
let modelOrder =  require('../Model/Order');

let checkUsersRole = require('./RoleCheck');
//0 -> default Value(Just Ordered)
//1 -> if chef notification, if waiter notification
//3 -> done
//4 -> reject




function uploadTotalPaymentForMenu(foodNameArray, setMenu,orderId,tableId){
    return new Promise((resolve, reject) => {
        var setPrice;
        var totalPrice=0.0;
        mFood.findOne({
            where: {
                id: foodNameArray[0]
            }
        }).then(food => {
            totalPrice = food.price;
            mTable.findOne({
                where: {
                    id: tableId
                }
            }).then(table => {
                totalPrice = table.totalPrice + beveragePrice;
                table.update({
                    totalPrice:totalPrice,
                    status:2
                }, {
                    where: {
                        id: tableId
                    }
                }).then(result => {
                    if (result > 0) {
                        resolve("Beverage Order is added successfully.");
                    } else {
                        reject("Beverage Order could not updated!");
                    }
                }).catch(error => {
                    reject(error);
                })
            }).catch(error => {
                reject(error);
            })
            resolve(beverage.price)
        }).catch(error => {
            reject(error);
        })
    })
    //içecek id sinden price i al
    //table id den totalprice'a bak,
    //içecek pricesini ekle
    //available to active
    //Active = 2 to available=1
}



function createMenuOrder(foodNameArray) {
    /*
    data.note
    data.tableId
    data.beverageId
    */

    return new Promise((resolve, reject) => {

        data.tableId = parseInt(data.tableId);
        data.beverageId = parseInt(data.beverageId);

        console.log(data);
        if (data.tableId == undefined || data.beverageId == undefined) {
            //throw new Error({'hehe':'haha'});
            reject("Proper input shall be sent!");
            return;
        }
        //table içine bak açık mı kapalı mı
        //order oluşturuldu
        mOrder.findOrCreate({
            where: {
                id: data.id
            },
            defaults: {
                note: data.note
            }
        })
            .then((order) => {
                console.log("order[0]"+JSON.stringify(order[0]));
                //------
                //Beverage Eklendi
                order[0].addBeverages(data.beverageId);
                order[0].addTables(data.tableId);
                //Table'a eklendi.


                uploadTotalPaymentForBeverage(data.beverageId, order.id, data.tableId).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                })
            })
    })

}



function uploadTotalPaymentForBeverage(beverageId, orderId,tableId){
    return new Promise((resolve, reject) => {
        var beveragePrice;
        var totalPrice=0.0;
        mBeverage.findOne({
            where: {
                id: beverageId
            }
        }).then(beverage => {
            beveragePrice = beverage.price;
            mTable.findOne({
                where: {
                    id: tableId
                }
            }).then(table => {
                totalPrice = table.totalPrice + beveragePrice;
                table.update({
                    totalPrice:totalPrice,
                    status:2
                }, {
                    where: {
                        id: tableId
                    }
                }).then(result => {
                    if (result > 0) {
                        resolve("Beverage Order is added successfully.");
                    } else {
                        reject("Beverage Order could not updated!");
                    }
                }).catch(error => {
                    reject(error);
                })
            }).catch(error => {
                reject(error);
            })
            resolve(beverage.price)
        }).catch(error => {
            reject(error);
        })
    })
    //içecek id sinden price i al
    //table id den totalprice'a bak,
    //içecek pricesini ekle
    //available to active
    //Active = 2 to available=1
}



function createAnBeverageOrder(data) {
    /*
    data.note
    data.tableId
    data.beverageId
    */
    console.log("Data: " + data);
    return new Promise((resolve, reject) => {

        data.tableId = parseInt(data.tableId);
        data.beverageId = parseInt(data.beverageId);

        console.log(data);
        if (data.tableId == undefined || data.beverageId == undefined) {
            //throw new Error({'hehe':'haha'});
            reject("Proper input shall be sent!");
            return;
        }
        //table içine bak açık mı kapalı mı
        //order oluşturuldu
        mOrder.findOrCreate({
            where: {
                id: data.id
            },
            defaults: {
                note: data.note
            }
        })
            .then((order) => {
                console.log("order[0]"+JSON.stringify(order[0]));
                //------
                //Beverage Eklendi
                order[0].addBeverages(data.beverageId);
                order[0].addTables(data.tableId);
                //Table'a eklendi.


                uploadTotalPaymentForBeverage(data.beverageId, order.id, data.tableId).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                })
            })
    })

}



function getPaymentOfTable(tableId) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where: {
                tableId: tableId,
                orderOpen:true
            },
            include: [{
                model: mPayment,
            }]
        }).then(result => {
            console.log(result[0].dataValues.totalPrice);
            var total =0;
            for (var key in result[0]) {
                console.log(result[0].dataValues);
                total += result[0].dataValues.totalPrice;
            }
            console.log(total);
            resolve(result);
        })
            .catch(error => {
                reject(error);
            })
    })

}



module.exports = function (app) {

    app.get('/order', function (request, response) {
        console.log('Order');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
            {
                response.sendFile(path.resolve('public/Pages/Order.html'));
            }
            else {
                    response.write(checkUsersRole.errorMesage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }

        //res.end();

    }),



        app.post('/api/order/orderBeverage', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
            {
                    var data = request.body;
                    createAnBeverageOrder(data).then(beverage => {
                        response.end(beverage.toString());
                    }).catch(error => {
                        response.end(error.toString());
                    })
                }
                else {
                    response.write(checkUsersRole.errorMesage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }
        }),

/*
        app.get('/api/order/:getNotification', function (request, response) {
                response.end(notifications + '\n');

            }),

    app.get('/api/order/:getAllOrders', function (req, res) {
        ordersController.findAll({ raw: true }).then(result =>{
            console.log(result);
            res.end(result);
        })

    }),
    */
    app.get('/api/order/:getPaymentOfTable', function (request, response) {
        if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
            || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
        {
            var tableId = request.params.getPaymentOfTable;

            tableId = parseInt(tableId);
            getPaymentOfTable(tableId).then(beverage => {
                response.end(beverage.toString());
            }).catch(error => {
                response.end(error.toString());
            })
        }
        else {
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }
    }),
        app.get('/api/order/getChefNotification', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
            {
                modelOrder.getChefNotification()
                    .then(notification=> {
                    response.end(notification);
                }).catch(error => {
                    response.end(error.toString());
                })
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        })



}




