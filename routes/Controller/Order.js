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

let checkUsersRole = require('./RoleCheck');
//0 -> default Value(Just Ordered)
//1 -> if chef notification, if waiter notification
//3 -> done
//4 -> reject



getABeverage = function (id){
    console.log("getABeverage " + id);
    return new Promise((resolve, reject) => {
        mBeverage.findOne({
            where:{
                id:id
            }
        })
            .then(dbData=>{
                console.log("Beverage Data " + dbData);
                if (dbData!= null && dbData != undefined){
                    resolve(dbData);
                }
                else{
                    reject("There is no beverage with this name: " + data.name);
                }
            }).catch(error => {
            reject(error);
        })
            .catch(error=>{
                reject(error);
            })

    })
}



function createPayment(){
    return new Promise((resolve, reject) => {
        mPayment.create({

        })
            .then((payment)=>{
            console.log("Payment Create inside "+ payment);
            resolve(payment);
        })
            .catch(error =>{
                reject("Payment could not be created!" + error);
            })
    })
}




function updatePayment(paymentId,price,quantity){
    console.log("Add Payment" + paymentId,price);
    return new Promise((resolve, reject) => {
        mPayment.findOne({
            where:
                {
                    id: paymentId
                }
        }).then((payment) => {
            console.log("Payment Payment" + payment);

            var p = payment.totalPrice + (price*quantity);
            payment.update({
                totalPrice: p,
                where: {
                    id: paymentId
                }
            }).then(payment => {
                resolve("Payment is updated successfully.")
            }).catch(error => {
                reject("Payment Cannot Be Updated!" + error);
            })

        }).catch(error => {
            reject(error);
        })
    }).catch(error => {
        reject("Payment Cannot Be Updated!" + error);
    })
}



function updateOrdersPayment(order,paymentId,tableId) {
    return new Promise((resolve, reject) => {
        order.update({
            paymentId: paymentId,
            tableId: tableId,
            where: {
                id: order.id
            }
        }).then(result => {
            resolve(true);
            /*if (result > 0) {
                resolve(true)
            } else {
                reject(false);
            }*/
        })
            .catch(error => {
                reject(error);
            })
    })
}


function createAnBeverageOrder(data) {
    /*
    data.note yeterli
    beverageId need
    tableId: need
     */
    console.log("Data: " + data);
    return new Promise((resolve, reject) => {

        data.tableId = parseInt(data.tableId);
        data.beverageId = parseInt(data.beverageId);
        data.quantity = parseInt(data.quantity);
        console.log(data);
        if (data.tableId == undefined || data.beverageId == undefined || data.quantity == undefined) {
            //throw new Error({'hehe':'haha'});
            reject("Proper input shall be sent!");
            return;
        }
        //table içine bak açık mı kapalı mı
        //order oluşturuldu
            mOrder.findOrCreate({
                where:{
                    id:data.id
                },
                defaults:{
                    note:data.note
                }
            })
            .then((order) => {
                console.log(order[0]);
            //------
            //Beverage Eklendi
            order[0].addBeverages(data.beverageId);
            //------
            //PaymentId alındı veya oluşturuldu
                var paymentId;
                if (order[0].paymentId==null||order[0].paymentId==undefined) {
                    console.log("if block");
                    createPayment().then(payment => {
                        console.log("Payment Created!");
                        paymentId  = payment.id;
                        //var table = isTableExist(data.tableId);
                        console.log("TableId: " + data.tableId + " paymentId:" + paymentId);
                        updateOrdersPayment(order[0], paymentId, data.tableId)
                            .then(value => {
                                console.log("TableId and PaymentId is added to order!");
                                console.log("Beverage Bilgileri");
                                //Beverage Bilgileri
                                getABeverage(data.beverageId)
                                    .then(bev => {
                                        console.log("Beverage Bilgileri Then");
                                        console.log("Payment Id " + paymentId + " Beverage Price: " + bev.price);
                                        updatePayment(paymentId, bev.price,data.quantity).then(result=>{
                                            console.log("Result "+ result);
                                        })
                                            .catch(error => {
                                                reject(error);
                                            })
                                    }).catch(error => {
                                    console.log("Beverage Bilgileri catch");
                                    reject(error);
                                })
                            })
                            .catch(error => {
                                reject(error);
                            })
                        })
                        .catch(error => {
                            reject(error);
                        })
                    }
            }).catch(error=>{
                reject(error);
            })




            resolve("Beverage ordered successfully.");

        }).catch(error => {
            reject("Beverage could not be ordered!" + error);
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


function createMenuOrder(data) {
    /*
    data.note yeterli
    beverageId need
    tableId: need
     */
    console.log("Data: " + data);
    return new Promise((resolve, reject) => {

        data.tableId = parseInt(data.tableId);
        data.menuName = parseInt(data.beverageId);
        data.quantity = parseInt(data.quantity);
        console.log(data);
        if (data.tableId == undefined || data.beverageId == undefined || data.quantity == undefined) {
            //throw new Error({'hehe':'haha'});
            reject("Proper input shall be sent!");
            return;
        }
        //table içine bak açık mı kapalı mı
        //order oluşturuldu
        mOrder.findOrCreate({
            where:{
                id:data.id
            },
            defaults:{
                note:data.note
            }
        })
            .then((order) => {
                console.log(order[0]);
                //------
                //Beverage Eklendi
                order[0].addBeverages(data.beverageId);
                //------
                //PaymentId alındı veya oluşturuldu
                var paymentId;
                if (order[0].paymentId==null||order[0].paymentId==undefined) {
                    console.log("if block");
                    createPayment().then(payment => {
                        console.log("Payment Created!");
                        paymentId  = payment.id;
                        //var table = isTableExist(data.tableId);
                        console.log("TableId: " + data.tableId + " paymentId:" + paymentId);
                        updateOrdersPayment(order[0], paymentId, data.tableId)
                            .then(value => {
                                console.log("TableId and PaymentId is added to order!");
                                console.log("Beverage Bilgileri");
                                //Beverage Bilgileri
                                getABeverage(data.beverageId)
                                    .then(bev => {
                                        console.log("Beverage Bilgileri Then");
                                        console.log("Payment Id " + paymentId + " Beverage Price: " + bev.price);
                                        updatePayment(paymentId, bev.price,data.quantity).then(result=>{
                                            console.log("Result "+ result);
                                        })
                                            .catch(error => {
                                                reject(error);
                                            })
                                    }).catch(error => {
                                    console.log("Beverage Bilgileri catch");
                                    reject(error);
                                })
                            })
                            .catch(error => {
                                reject(error);
                            })
                    })
                        .catch(error => {
                            reject(error);
                        })
                }
            }).catch(error=>{
            reject(error);
        })




        resolve("Beverage ordered successfully.");

    }).catch(error => {
        reject("Beverage could not be ordered!" + error);
    })


}




function createAnMenuOrder(data){

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
                }
        }).then((order)=>{
            console.log(order[0].get(0));
            order[0].addBeverages(data.menuName);
            resolve("Menu ordered successfully.");
        })
            .catch(error =>{
                reject("Menu could not be ordered!" + error);
            })

    })
}



module.exports = function (app,session) {

    app.get('/order', function (request, response) {
        console.log('Order');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId))) {
                response.sendFile(path.resolve('../../public/Pages/Order.html'));
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
                    ||  checkUsersRole.isCashier(request.session.roleId))) {
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
            ||  checkUsersRole.isCashier(request.session.roleId))) {
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
    })


}




