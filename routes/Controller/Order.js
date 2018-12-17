let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let isTableExist = require('./Table').isTableExists;

let db = sequelize();
let dbNames = tableNames();
let mOrder = db.model(dbNames.order);
let mPayment = db.model(dbNames.payment);
let mBeverage = db.model(dbNames.beverage);
let mTable = db.model(dbNames.table);
let mFood = db.model(dbNames.food);
let mOrderTable = db.model(dbNames.orderTable);
let modelOrder =  require('../Model/Order');

let checkUsersRole = require('./RoleCheck');
//0 -> default Value(Just Ordered)
//1 -> if chef notification, if waiter notification
//3 -> done
//4 -> reject


function payOrders(mainCourse,appetizer,dessert,tableId,setMenu,orderId){
    return new Promise((resolve, reject) => {
        var totalPrice;
        var mainCoursePrice,appetizerPrice,dessertPrice;
        mFood.findOne({
            where: {
                foodName: mainCourse
            }
        }).then(mC => {
            mainCoursePrice = mC.price;
            mFood.findOne({
                where: {
                    foodName: appetizer
                }
            }).then(appetizer=>{
                appetizerPrice  = appetizer.price;
                mFood.findOne({
                    where: {
                        foodName: dessert
                    }
                }).then(dessert=>{
                    dessertPrice = dessert.price;
                    mTable.findOne({
                        where: {
                            id: tableId
                        }
                    }).then(table => {
                        if (setMenu>0){
                            totalPrice = setMenu;
                        }else{
                            totalPrice = table.totalPrice + mainCoursePrice + appetizerPrice + dessertPrice;
                        }
                        table.update({
                            totalPrice:totalPrice,
                            status:2
                        }, {
                            where: {
                                id: tableId
                            }
                        }).then(result => {
                            if (result > 0) {
                                resolve("Menu Order is added successfully.");
                            } else {
                                reject("Menu Order could not updated!");
                            }
                        }).catch(error => {
                            reject(error);
                        })
                    }).catch(error => {
                        reject(error);
                    })
                }).catch(error=>{
                    reject(error);
                })
            }).catch(error=>{
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





function uploadTotalPaymentForMenu(data,setMenu){
    return new Promise((resolve, reject) => {
        var totalPrice;
        var mainCoursePrice=0,appetizerPrice=0,dessertPrice=0;

        mFood.findOne({
            where: {
                name: data.mainCourse
            }
        }).then(mC => {
            if (mC!=undefined && mC!=null) {
                mainCoursePrice = mC.price;
            }
                mFood.findOne({
                    where: {
                        name: data.appetizer
                    }
                }).then(appetizer=>{
                    if (appetizer!=undefined && appetizer!=null){
                        appetizerPrice  = appetizer.price;
                    }
                    mFood.findOne({
                        where: {
                            name: data.dessert
                        }

                    }).then(dessert=>{
                        if (dessert!=undefined && dessert!=null) {
                            dessertPrice = dessert.price;
                        }
                        mTable.findOne({
                            where: {
                                id: data.tableId
                            }
                        }).then(table => {
                            if (setMenu>0){
                                totalPrice = setMenu;
                            }else{
                                totalPrice = table.totalPrice + mainCoursePrice + appetizerPrice + dessertPrice;
                            }
                            table.update({
                                totalPrice:totalPrice,
                                status:2
                            }, {
                                where: {
                                    id: data.tableId
                                }
                            }).then(result => {
                                if (result != null && result!=undefined) {
                                    resolve("Food Order is added successfully.");
                                } else {
                                    reject("Food Order could not updated!");
                                }
                            }).catch(error => {
                                reject(error);
                            })
                        }).catch(error => {
                            reject(error);
                        })
                    }).catch(error=>{
                        reject(error);
                    })
                }).catch(error=>{
                    reject(error);
                })
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



function createMenuOrder(data) {
    /*
    data.note
    data.tableId
    data.beverageId

    mainCourse,appetizer,dessert,tableId

    */

    return new Promise((resolve, reject) => {

        //data.tableId = parseInt(data.tableId);
            console.log("DATAAAAAA"+data);
        if (data.tableId == undefined) {
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
                console.log("ORDERSSSSS->"+order);

                console.log(data);

                //------
                //Food Eklendi
                var isSetMenu=0;

                if (data.mainCourse!=0 && data.mainCourse!=undefined ){

                    var x ="INSERT INTO \"orderFoods\" (\"foodName\", \"orderId\",\"createdAt\",\"updatedAt\") " +
                        "VALUES ("+"'"+data.mainCourse+"',"+ order[0].id+",'10.10.2010','10.10.2010')";
                    console.log(x);
                    db.query(x, {
                    });
                    console.log(data.mainCourse);
                    //order[0].addFood(data.mainCourse);
                    isSetMenu++;
                }
                if (data.appetizer!=0&& data.mainCourse!=undefined){
                    //order[0].addFood(data.appetizer);
                    var x ="INSERT INTO \"orderFoods\" (\"foodName\", \"orderId\",\"createdAt\",\"updatedAt\") " +
                        "VALUES ("+"'"+data.appetizer+"',"+ order[0].id+",'10.10.2010','10.10.2010')";
                    console.log(x);
                    db.query(x, {
                    });
                    console.log(data.appetizer);
                    isSetMenu++;
                }
                if (data.dessert!=0&& data.mainCourse!=undefined){
                    //order[0].addFood(data.dessert);
                    var x ="INSERT INTO \"orderFoods\" (\"foodName\", \"orderId\",\"createdAt\",\"updatedAt\") " +
                        "VALUES ("+"'"+data.dessert+"',"+ order[0].id+",'10.10.2010','10.10.2010')";
                    console.log(x);
                    db.query(x, {
                    });
                    console.log(data.dessert);
                    isSetMenu++;
                }

                order[0].addTables(data.tableId);
                //Table'a eklendi.
                var setMenu=0;
                if(isSetMenu==3){
                    setMenu=40;
                }
                console.log(isSetMenu)

                uploadTotalPaymentForMenu(data, setMenu).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject("======uploadTotalPaymentForMenu====Error"+error);
                })
            })
    })

}


//isFoodReady 0 ise şef önünde ekranda duracak
function getChefNotification (username) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    isFoodReady: 0
                },
            include: [
                {
                    model:mTable,
                    through: mOrderTable,
                    where:{
                        userUsername:username
                    }
                },

            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}

function uploadTotalPaymentForBeverage(beverageId, orderId,tableId,quantity){
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
                totalPrice = table.totalPrice + (beveragePrice*quantity);
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
    data.quantity
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


                uploadTotalPaymentForBeverage(data.beverageId, order.id, data.tableId,data.quantity).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                })
            })
    })

}


function decrementPayment(tableId,priceToDecrement) {
    return new Promise((resolve, reject) => {
        mTable.findAll({
            where: {
                id: tableId,
            },
            include: [{
                model:mOrder
            }]
        }).then(result => {
            console.log(JSON.stringify(result));
            result[0].totalPrice
            resolve(JSON.stringify(result));
        })
            .catch(error => {
                reject(error);
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
        app.post('/api/order/orderFood', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
            {
                var data = request.body;
                console.log("orderFood"+data);
                createMenuOrder(data).then(food=> {
                    response.end(food.toString());
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
                getChefNotification(request.session.username)
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
        }),
        app.post('/api/order/decrementToPayment', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
            {
                var data = request.body;
                decrementPayment(data.tableId,data.price)
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




