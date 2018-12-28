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
let mMenu = db.model(dbNames.menu);
let mOrderFood = db.model(dbNames.orderFood);
let mOrderBeverage =db.model(dbNames.orderBeverage);


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

function updateQuantityOfAFood(food) {
    return new Promise((resolve, reject) => {

        var q=food.quantity;
        if (q>0){
            q--;
            food.update({
                quantity:q
            },
                {
                where:{
                    name:food.name
                }

                }).then(updated=>{
                    if (updated>0){
                      console.log("quantity updated");
                    }
            }).catch(error=>{
                reject(error);
            })
        }
        else{
            reject(food.name + " is not available right now!");
        }


    })
}



function uploadTotalPaymentForMenu(data,flag) {
    return new Promise((resolve, reject) => {
        var myTotalPrice = 0;
        var mainCoursePrice = 0, appetizerPrice = 0, dessertPrice = 0;

        mFood.findOne({
            where: {
                name: data.mainCourse
            }
        }).then(mC => {
            if (mC != undefined && mC != null) {
                mainCoursePrice = mC.price;
                updateQuantityOfAFood(mC).then(t=>{

                }).catch(error=>{
                    reject(error);
                });
            }
            mFood.findOne({
                where: {
                    name: data.appetizer
                }
            }).then(appetizer => {
                if (appetizer != undefined && appetizer != null) {
                    appetizerPrice = appetizer.price;
                    updateQuantityOfAFood(appetizer).then(t=>{

                    }).catch(error=>{
                        reject(error);
                    });
                }
                mFood.findOne({
                    where: {
                        name: data.dessert
                    }

                }).then(dessert => {
                    if (dessert != undefined && dessert != null) {
                        dessertPrice = dessert.price;
                        updateQuantityOfAFood(dessert).then(t=>{

                        }).catch(error=>{
                            reject(error);
                        });
                    }
                    mTable.findOne({
                        where: {
                            id: data.tableId
                        }
                    }).then(table => {
                        mMenu.findOne({
                            attributes: ['setPrice'],
                            where: {
                                isActive: true
                            }
                        }).then(menu => {
                            if (flag == true) {
                                var d = menu.toJSON();
                                myTotalPrice = table.totalPrice + d['setPrice'];
                            }
                            else {
                                myTotalPrice = table.totalPrice + mainCoursePrice + appetizerPrice + dessertPrice;
                            }
                            table.update({
                                totalPrice: myTotalPrice,
                                status: 2
                            }, {
                                where: {
                                    id: data.tableId
                                }
                            }).then(result => {
                                console.log(JSON.stringify(result));
                                if (result != null && result != undefined) {
                                    resolve("Food Order is added successfully.");
                                } else {
                                    reject("Food Order could not be given!");
                                }
                            }).catch(error => {
                                reject(error);
                            })
                        }).catch(error => {
                            reject(error);
                        })
                    }).catch(error => {
                        reject(error);
                    })
                }).catch(error => {
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
    })
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
                var flag=false;
                if(isSetMenu==3){
                    flag=true
                }
                console.log(isSetMenu)

                uploadTotalPaymentForMenu(data,flag).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject("Food Order could not be given!\n"+error);
                })
            })
    })

}

//isFoodReady 0 ise matre önünde ekranda duracak
function getMatreNotificationWithName () {
    return new Promise((resolve, reject) => {
        mOrderFood.findAll({

        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}

//chef onaylıyor (2) Yemek hazır. Garson
function bartenderApprovesBeverageReady(orderId) {
    console.log('chefApprovesFoodReady ');
    return new Promise((resolve, reject) => {
        mOrder.update(
            {
                isFoodReady: 1
            },
            {
                where:
                    {
                        id: orderId,
                    }
            }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}


//isFoodReady 0 ise matre önünde ekranda duracak
function getMatreNotification () {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen:true,
                    isFoodReady:0
                },
            include: [
                {
                    model:mFood,
                    through: mOrderFood,
                },
                /*
                {
                    model:mBeverage,
                    through: mOrderBeverage
                }
                */
            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}

//isFoodReady 0 ise şef önünde ekranda duracak
function getAllOpenOrders () {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen:true
                },
            include: [
                {
                    model:mFood,
                    through: mOrderFood,
                },
                {
                    model:mBeverage,
                    through: mOrderBeverage
                },
            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}
/*
//isFoodReady 0 ise şef önünde ekranda duracak
function getChefNotification () {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    isFoodReady: 0,
                },
            include: [
                {
                    model:mTable,
                    through: mOrderTable,
                    where:{
                        status:2
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
*/

//isFoodReady 0 ise şef önünde ekranda duracak
function getChefNotificationWithFoodName () {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    isFoodReady: 0,
                },
            include: [
                {
                    model:mFood,
                    through: mOrderFood,
                    where:{
                        foodName:{
                            any:'%'
                        }
                    }
                }
            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}


//isFoodReady 0 ise şef önünde ekranda duracak
function getChefNotificationForBartender () {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    isBeverageReady: 0,
                },
            include: [
                {
                    model:mBeverage,
                    through: mOrderBeverage,
                }
            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}


//chef onaylıyor (2) Yemek hazır. Garson
function bartenderApprovesBeverageReady(orderId) {
    console.log('chefApprovesFoodReady ');
    return new Promise((resolve, reject) => {
        mOrder.update(
            {
                isFoodReady: 1
            },
            {
                where:
                    {
                        id: orderId,
                    }
            }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}

//chef onaylıyor (1) yapıyor, Garsona Food onaylandı görünecek
exports.maltreApprovesOrder = function (orderId) {
    return new Promise((resolve, reject) => {
        Order.update(
            {
                isFoodReady: 1
            },
            {
                where:
                    {
                        id: orderId,
                    }
            }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}


//Garson get Food Onaylandı
exports.getWaiterFoodApproved = function (orderId) {
    return new Promise((resolve, reject) => {
        mOrder.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 1
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}



//chef onaylıyor (2) Yemek hazır. Garson
chefApprovesFoodReady = function (orderId) {
    console.log('chefApprovesFoodReady ');
    return new Promise((resolve, reject) => {
        mOrder.update(
            {
                isFoodReady: 2
            },
            {
            where:
                {
                    id: orderId,
                }
        }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}

//Waiter Food Ready mesajını alıyor.
exports.getWaiterNotificationApprovedFood = function(orderId){
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 2
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}



//Waiter 3'e setleyip, yemek teslim edildi. Successfull
exports.waiterCloseOrder = function (orderId) {
    return new Promise((resolve, reject) => {
        Order.update({
            where:
                {
                    id: orderId,
                    isFoodReady: 3
                }
        }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}


exports.getWaiterFoodDone = function(orderId){
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 3
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}

exports.getFoodRejected = function(orderId){
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 4
                }
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
                    if (result != null && result != undefined) {
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


/*
function getPaymentOfTable(tableId) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: tableId,
            },
            include: [{
                model: mOrder,
                through:mOrderTable
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
*/


module.exports = function (app) {

    app.get('/order', function (request, response) {
        console.log('Order');
            if (request.session != undefined  && (
                 checkUsersRole.isWaiter(request.session.roleId)))
            {
                response.sendFile(path.resolve('public/Pages/order.html'));
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
    app.get('/api/order/getPaymentOfTable', function (request, response) {
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
/*
        app.get('/api/order/getChefNotificationWithName', function (request, response) {
        if (request.session != undefined  && (checkUsersRole.isChef(request.session.roleId)))
        {
            //request.session.username
            getChefNotificationWithName()
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
    */
        app.get('/api/order/getAllOpenOrders', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isChef(request.session.roleId)))
            {
                //request.session.username
                getAllOpenOrders()
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
        app.get('/api/order/chefApprovesFoodReady/:orderId', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isChef(request.session.roleId)))
            {
                //request.session.username
                chefApprovesFoodReady(request.params.orderId)
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

    app.get('/api/order/getChefNotificationWithFoodName/:orderId', function (request, response) {
        if (request.session != undefined  && (checkUsersRole.isChef(request.session.roleId)))
        {
            //request.session.username
            getChefNotificationWithFoodName(request.params.orderId)
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

        app.get('/api/order/getChefNotificationWithFoodName/:orderId', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isChef(request.session.roleId)))
            {
                //request.session.username
                getChefNotificationWithFoodName(request.params.orderId)
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
        app.get('/api/order/getChefNotificationForBartender', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isBartender(request.session.roleId)))
            {
                //request.session.username
                getChefNotificationForBartender()
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
        app.get('/api/order/bartenderApprovesBeverageReady/:orderId', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isBartender(request.session.roleId)))
            {
                //request.session.username
                bartenderApprovesBeverageReady(request.params.orderId)
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
        app.get('/api/order/getMatreNotification', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId)))
            {
                getMatreNotification()
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




