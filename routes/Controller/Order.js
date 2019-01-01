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
let mOrderBeverage = db.model(dbNames.orderBeverage);

let mMenuController = require('../Controller/Menu');


let modelOrder = require('../Model/Order');

let checkUsersRole = require('./RoleCheck');
//0 -> default Value(Just Ordered)
//1 -> if chef notification, if waiter notification
//3 -> done
//4 -> reject

function uploadTotalPaymentForBeverage(beverageId, tableId, addition) {
    return new Promise((resolve, reject) => {
        var beveragePrice;
        var totalPrice = 0.0;
        var tableStatus = 2;
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
                if (addition == true) {
                    totalPrice = table.totalPrice + beveragePrice;
                } else if (addition == false) {
                    totalPrice = table.totalPrice - beveragePrice;
                    if (totalPrice < 0) {
                        totalPrice = table.totalPrice + beveragePrice;
                        reject("This transaction cannot be done!")
                    } else if (totalPrice == 0) {
                        tableStatus == 1
                    }
                }
                table.update({
                    totalPrice: totalPrice,
                    status: tableStatus
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
        data.quantity = parseInt(data.quantity);
        data.tableId = parseInt(data.tableId);
        data.beverageId = parseInt(data.beverageId);

        console.log(data);
        if (data.tableId == undefined || data.beverageId == undefined) {
            //throw new Error({'hehe':'haha'});
            reject("Proper input shall be sent!");
            return;
        }
        //order oluşturuldu
        mOrder.findOrCreate({
            where: {
                id: data.id
            },
            defaults: {
                note: data.note,
                isBeverageReady: 0
            }
        })
            .then((order) => {
                console.log("order[0]" + JSON.stringify(order[0]));
                //------
                //Beverage Eklendi
                order[0].addBeverages(data.beverageId);
                order[0].addTables(data.tableId);
                //Table'a eklendi.

                uploadTotalPaymentForBeverage(data.beverageId, data.tableId, true).then(result => {
                    data.quantity--;
                    if (data.quantity == 0) {
                        resolve(result);
                    } else {
                        resolve(createAnBeverageOrder(data))
                    }
                }).catch(error => {
                    reject(error);
                })
            })


    })

}

function createMenuOrder(data) {
    /*
    data.note
    data.tableId
    data.mainCourse
data.appetizer
data.dessert
    mainCourse,appetizer,dessert,tableId

    */

    return new Promise((resolve, reject) => {

        //data.tableId = parseInt(data.tableId);
        console.log("Menu Data : " + data);
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
                note: data.note,
                isFoodReady: 1
            }
        })
            .then((order) => {
                console.log("order[0]" + JSON.stringify(order[0]));
                //------
                //Food Eklendi
                var isSetMenu = 0;

                if (data.mainCourse != 0 && data.mainCourse != undefined) {
                    mFood.findOne({
                        where:
                            {
                                name: data.mainCourse
                            }
                    }).then((food1) => {
                        order[0].addFood(food1.id);

                    }).catch(error => {
                        reject(error);
                    })
                    isSetMenu++;

                }
                if (data.appetizer != 0 && data.mainCourse != undefined) {
                    mFood.findOne({
                        where:
                            {
                                name: data.appetizer
                            }
                    }).then((food2) => {
                        order[0].addFood(food2.id);

                    }).catch(error => {
                        reject(error);
                    })
                    isSetMenu++;

                }
                if (data.dessert != 0 && data.mainCourse != undefined) {
                    mFood.findOne({
                        where:
                            {
                                name: data.dessert
                            }
                    }).then((food3) => {
                        order[0].addFood(food3.id);

                    }).catch(error => {
                        reject(error);
                    })
                    isSetMenu++;


                }

                order[0].addTables(data.tableId);
                //Table'a eklendi.
                var flag = false;
                if (isSetMenu == 3) {
                    flag = true
                }

                uploadTotalPaymentForMenu(data, flag).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject("Food Order could not be given!\n" + error);
                })
            })
    })

}

function payOrders(mainCourse, appetizer, dessert, tableId, setMenu, orderId) {
    return new Promise((resolve, reject) => {
        var totalPrice;
        var mainCoursePrice, appetizerPrice, dessertPrice;
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
            }).then(appetizer => {
                appetizerPrice = appetizer.price;
                mFood.findOne({
                    where: {
                        foodName: dessert
                    }
                }).then(dessert => {
                    dessertPrice = dessert.price;
                    mTable.findOne({
                        where: {
                            id: tableId
                        }
                    }).then(table => {
                        if (setMenu > 0) {
                            totalPrice = setMenu;
                        } else {
                            totalPrice = table.totalPrice + mainCoursePrice + appetizerPrice + dessertPrice;
                        }
                        table.update({
                            totalPrice: totalPrice,
                            status: 2
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

function updateQuantityOfAFood(food) {
    return new Promise((resolve, reject) => {

        var q = food.quantity;
        if (q > 0) {
            q--;
            food.update({
                    quantity: q
                },
                {
                    where: {
                        name: food.name
                    }

                }).then(updated => {
                if (updated > 0) {
                    console.log("quantity updated");
                }
            }).catch(error => {
                reject(error);
            })
        }
        else {
            reject(food.name + " is not available right now!");
        }


    })
}

function uploadTotalPaymentForMenu(data, flag) {
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
                updateQuantityOfAFood(mC).then(t => {

                }).catch(error => {
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
                    updateQuantityOfAFood(appetizer).then(t => {

                    }).catch(error => {
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
                        updateQuantityOfAFood(dessert).then(t => {

                        }).catch(error => {
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

function getActiveMenu() {
    console.log();
    return new Promise((resolve, reject) => {
        mMenu.findOne({
            where: {
                isActive: true
            },
        }).then(data => {
            if (data != null && data != undefined) {
                //var mydata = data.getFood()
                //console.log(JSON.stringify(mydata));
                //resolve(JSON.stringify(data));
                resolve(data);
            }
            else
                reject("Cannot get the Menu's Food!");
        }).catch(error => {
            reject(error);
        })

    })
}

function getATable(id) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: id
            }
        }).then(data => {
            if (data != null && data != undefined) {
                resolve(data);
            } else {
                reject("There is no table with this id: " + id);
            }
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}

//FOOD NOTIFICATIONS
//isFoodReady 1 ise Matre ve Chef önünde ekranda duracak.
function getMatreAndChefNotification() {
    return new Promise((resolve, reject) => {

        mOrder.findAll({
            attributes:['id'],
            where:
                {
                    orderOpen: true,
                },
            /*
            include: [
                {
                    through: {
                        isFoodReady: -1
                    }
                }],
                */
                include:[
                    {
                        model:mFood,
                        through:mOrderFood

                    },
                    /*{
                         through: {
                            isFoodReady:-1
                        },
                        //attributes:['name','price']
                    },*/
                    {
                        model:mTable,
                        through: mOrderTable,
                    }
                ],

        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })

    })
}


//isFoodReady 4 yapacak. Order iptal. matre ve chef iptal etmek için bu apiyi çağıracak.
function rejectMenu(data) {
    /*
    orderId
    tableId
    foodId
     */
    return new Promise((resolve, reject) => {
        data.orderId = parseInt(data.orderId);
        data.foodId = parseInt(data.foodId);
        var isSet = 0;
        var price = 0;
        mOrderFood.findAll({
            where: {
                orderId: data.orderId
            },
            raw: true
        }).then(orders => {
            if (orders == null && orders == undefined) {
                resolve("There is no order with this order id : " + data.orderId)
            } else {
                var len = orders.length;
                if (len == 3) {
                    getActiveMenu().then(menu => {
                        if (menu != undefined && menu != null && len == 3) {
                            price = menu['setPrice'];
                            console.log(price)
                            var newData=Object.create(orders);
                            for (var i = 0; i<3;i++){
                                console.log(orders[i].foodId +" "+ data.foodId)
                                if (orders[i].foodId != data.foodId){
                                    newData.splice(i,1)
                                }
                            }
                            console.log("orders"+JSON.stringify(newData))

                            mFood.findOne({
                                where: {
                                    id: orders[0].foodId
                                }
                            }).then(menu1 => {
                                console.log(orders[0].foodId);
                                console.log(orders[0].foodId[0]);
                            }).catch(error => {
                                reject(error)
                            })
                        } else {
                            //order[0].foodId

                        }

                    }).catch(error => {
                        reject(error)
                    })
                } else {
                    mFood.findOne({
                        where: {
                            id: data.orderId
                        },
                        raw: true
                    }).then(menu1 => {
                        console.log(menu1)
                        price = menu1.price
                    }).catch(error => {
                        reject(error)
                    })
                }
            }
        })
    })


    /*
                    console.log("Price:" + price)
                        getATable(data.tableId).then(aTable => {
                            var totalPrice = aTable['totalPrice'];
                            console.log("First : totalPrice:" + totalPrice)
                            totalPrice -= price;

                            if (totalPrice < 0) {
                                totalPrice += price;
                                reject("The price cannot be lower than 0TL");
                            }
                            console.log("Second : totalPrice:" + totalPrice)
                            mOrderFood.update({
                                    isFoodReady: 4
                                },
                                {
                                    where: {
                                        orderId: data.orderId
                                    }
                                })
                                .then(table => {
                                    if (table != null && table != undefined && table > 0) {
                                        mTable.update({
                                            totalPrice: totalPrice,
                                        }, {
                                            where: {
                                                id: data.tableId
                                            }
                                        })
                                            .then(result => {
                                                console.log(JSON.stringify(result));
                                                if (result != null && result != undefined) {
                                                    resolve("The Food(s) is rejected!");
                                                } else {
                                                    reject("The Food could not be rejected!");
                                                }
                                            })
                                            .catch(error => {
                                                reject(error);
                                            })
                                    }
                                })
                                .catch(error => {
                                    reject(error);
                                })
                        }).catch(error => {
                            reject(error)
                        })
                    }).catch(error => {
                        reject(error);
                    })
                })
            }
        }
    })
*/


}

//2 -> Chef yemek hazır dedi. waiter önüne düşecek.
function foodIsReady(orderId,foodId) {
    return new Promise((resolve, reject) => {
        console.log("Order - Food Ids :"+orderId+foodId)
        mOrderFood.update(
            {
                isFoodReady:2
            },
            {
                where:
                    {
                        orderId: orderId,
                        foodId:foodId
                    }
            }).then((order) => {
            if (order > 0)
                resolve("Menu is updated to 2!")
            else
                reject('Menu could not updated to 2!');
        }).catch(error => {
            reject(error);
        })
    })
}

//get Ready foods
function getReadyFoods(userUsername) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            attributes:['id'],
            where:
                {
                    orderOpen: true,
                },
            include:[
                {
                    model:mFood,
                    through:mOrderFood

                },
/*
                {
                    through:mOrderFood,
                    where:{
                        isFoodReady:2
                    }
                 },
*/
                {
                    model:mTable,
                    through: mOrderTable,
                    where:{
                        userUsername:userUsername
                    }
                }
            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })
    })
}

//3 -> Waiter served the food. Approve
function foodIsServed(orderId,foodId) {
    return new Promise((resolve, reject) => {
        mOrderFood.update(
            {
                isFoodReady:3
            },
            {
                where:
                    {
                        orderId: orderId,
                        foodId:foodId
                    }
            }).then((order) => {
            if (order > 0)
                resolve("Menu is served!")
            else
                reject('Menu could not served!');
        }).catch(error => {
            reject(error);
        })
    })
}

//get Rejeced Foods
function getRejectedFoods(userUsername) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen: true,
                },
            include:
                [
                    {
                        model: mFood,
                        through: mOrderFood,
                        where:{
                            isFoodReady:4
                        }
                    },
                    {
                        model: mTable,
                        through: mOrderTable,
                        where: {
                            userUsername: userUsername
                        }
                    }
                ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })
    })
}

//5 -> rejectedFoodsAreSeen-> Approve
function rejectedFoodsAreSeen(orderId) {
    return new Promise((resolve, reject) => {
        mOrder.update(
            {
                isFoodReady:5
            },
            {
                where:
                    {
                        orderId: orderId,
                    }
            }).then((order) => {
            if (order > 0)
                resolve("Menu is served!")
            else
                reject('Menu could not served!');
        }).catch(error => {
            reject(error);
        })
    })
}

//FOOD NOTIFICATIONS

//isFoodReady 0 ise şef önünde ekranda duracak
function getAllOpenOrders() {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen: true
                },
            include: [
                {
                    model: mFood,
                    through: mOrderFood,
                },
                {
                    model: mBeverage,
                    through: mOrderBeverage
                },
            ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })
    })
}

///// BEVERAGE NOTIFICATIONS
//Bartender will call this api. Get Ordered Beverage But not approved or rejected yet
function getNotificationForBartender(userUsername) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen: true,
                    isBeverageReady: 0
                },
            include:
                [
                    {
                        model: mBeverage,
                        through: mOrderBeverage,
                    },

                    {
                        model: mTable,
                        through: mOrderTable
                    }
                ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })

    })
}

//bartender approves or rejects. Update 1 or 4
function bartenderApproveOrRejectBeverage(orderId, beverageId, tableId, accepted) {

    return new Promise((resolve, reject) => {
        //accepted = true or false
        var val = 1;
        if (accepted == 'false') {
            val = 4;
        }
        console.log("accepted" + accepted + " " + val)

        mOrder.update(
            {
                isBeverageReady: val
            },
            {
                where:
                    {
                        id: orderId,
                    }
            }).then((order) => {
            console.log(order);
            if (order > 0) {
                if (accepted == 'true')
                    resolve("Bartender approved.");
                else {
                    uploadTotalPaymentForBeverage(beverageId, tableId, false)
                    reject('Bartender rejected!');
                }
            } else {
                reject('Could not update the table!');
            }
        })
            .catch(error => {
                reject(error);
            })

    })

}

//Waiter gets ready beverages
function getReadyBeverages(userUsername) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen: true,
                    isBeverageReady: 1,
                },
            include:
                [
                    {
                        model: mBeverage,
                        through: mOrderBeverage,
                    },
                    {
                        model: mTable,
                        through: mOrderTable,
                        where: {
                            userUsername: userUsername
                        }
                    }
                ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })

    })
}

//bartender beverage is ready -> updates 2
function waiterServedBeverage(orderId) {
    /*
    data.orderId
     */
    return new Promise((resolve, reject) => {
        mOrder.update(
            {
                isBeverageReady: 2
            },
            {
                where:
                    {
                        id: orderId,
                    }
            }).then((order) => {
            if (order > 0)
                resolve("Beverage is served!")
            else
                reject('Beverage could not be served functionally!');
        }).catch(error => {
            reject(error);
        })
    })
}

//Waiter gets rejected beverages
function getRejectedBeverages(userUsername) {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen: true,
                    isBeverageReady: 4,
                },
            include:
                [
                    {
                        model: mBeverage,
                        through: mOrderBeverage,
                    },
                    {
                        model: mTable,
                        through: mOrderTable,
                        where: {
                            userUsername: userUsername
                        }
                    }
                ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })

    })
}


//Rejected beverages Are Seen -> 5
function rejectedBeveragesAreSeen(orderId) {
    /*
    data.orderId
     */
    return new Promise((resolve, reject) => {
        mOrder.update(
            {
                isBeverageReady: 5
            },
            {
                where:
                    {
                        id: orderId,
                    }
            }).then((order) => {
            if (order > 0)
                resolve("Beverage is served!")
            else
                reject('Beverage could not be served functionally!');
        }).catch(error => {
            reject(error);
        })
    })
}

/*
//Bartender will call this api. Get Ordered Beverage But not approved or rejected yet
function getNotificationOfReadyBeverages() {
    return new Promise((resolve, reject) => {
        mOrder.findAll({
            where:
                {
                    orderOpen: true,
                    isBeverageReady: 2,
                },
            include:
                [
                    {
                        model: mBeverage,
                        through: mOrderBeverage,
                    },
                ],
            include:
                [
                    {
                        model: mTable,
                        through: mOrderTable,
                    }
                ]
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error => {
            reject(error);
        })

    })
}
*/

///// BEVERAGE NOTIFICATIONS




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
        if (request.session != undefined && (
            checkUsersRole.isWaiter(request.session.roleId))) {
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

        app.get('/matreNotification', function (request, response) {
            console.log('Order');
            if (request.session != undefined && (
                checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId)
            )) {
                response.sendFile(path.resolve('public/Pages/matreNotification.html'));
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
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId))) {
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
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId))) {
                var data = request.body;
                console.log("orderFood" + data);
                createMenuOrder(data).then(food => {
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
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId))) {
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
            if (request.session != undefined && (checkUsersRole.isChef(request.session.roleId))) {
                //request.session.username
                getAllOpenOrders()
                    .then(notification => {
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
        if (request.session != undefined && (checkUsersRole.isChef(request.session.roleId))) {
            //request.session.username
            getChefNotificationWithFoodName(request.params.orderId)
                .then(notification => {
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
            if (request.session != undefined && (checkUsersRole.isChef(request.session.roleId))) {
                //request.session.username
                getChefNotificationWithFoodName(request.params.orderId)
                    .then(notification => {
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

        app.get('/api/order/getNotificationForBartender', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isBartender(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {
                getNotificationForBartender(request.session.username)
                    .then(notification => {
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
        app.post('/api/order/bartenderApproveOrRejectBeverage', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isBartender(request.session.roleId))) {
                var data = request.body;
                bartenderApproveOrRejectBeverage(data.orderId, data.beverageId, data.tableId, data.accepted)
                    .then(notification => {
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
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId) ||checkUsersRole.isChef(request.session.roleId) )) {
                getMatreAndChefNotification()
                    .then(notification => {
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
        app.get('/api/order/getReadyBeverages', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {
                getReadyBeverages(request.session.username)
                    .then(notification => {
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
        app.post('/api/order/waiterServedBeverage', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {
                waiterServedBeverage(request.body.orderId)
                    .then(notification => {
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



        app.post('/api/order/reduceMenuPayment', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isChef(request.session.roleId))) {
                var data = request.body;
                rejectMenu(data).then(beverage => {
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

    app.get('/api/order/foodIsReady/:orderId/:foodId', function (request, response) {
        if (request.session != undefined && (checkUsersRole.isChef(request.session.roleId))) {
            var orderId = request.params.orderId;
            var foodId = request.params.foodId;
            foodIsReady(orderId,foodId).then(result => {
                response.end(result.toString());
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

        app.post('/api/order/foodIsServed', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId))) {
                foodIsServed(request.body.orderId,request.body.foodId).then(result => {
                    response.end(result.toString());
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
        app.post('/api/order/rejectedBeveragesAreSeen', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId))) {
                rejectedBeveragesAreSeen(request.body.orderId).then(result => {
                    response.end(result.toString());
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
        app.post('/api/order/rejectedFoodsAreSeen', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId))) {
                rejectedFoodsAreSeen(request.body.orderId).then(result => {
                    response.end(result.toString());
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
        app.get('/api/order/getReadyFoods', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {

                getReadyFoods(request.session.username)
                    .then(notification => {
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
        app.get('/api/order/getRejectedBeverages', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {

                getRejectedBeverages(request.session.username)
                    .then(notification => {
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
        app.get('/api/order/getRejectedFoods', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isWaiter(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {

                getRejectedFoods(request.session.username)
                    .then(notification => {
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




