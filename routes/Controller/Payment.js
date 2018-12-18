let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let beverageFunc = require('./Beverage').getBeverage;


let db = sequelize();
let dbNames = tableNames();
let mPayment = db.model(dbNames.payment);
let mTable = db.model(dbNames.table);

let checkUsersRole = require('./RoleCheck');


function getAllPaymentByTableId(id){

        return new Promise((resolve, reject) => {
            mPayment.findAll({
                where: {
                    orderOpen:true
                },
                include: [
                    {
                        model: mTable,
                        where: { id: id}
                    }
                ]
            }).then(result=>{
                console.log(result);
                resolve(JSON.stringify(result));
            }).catch(error=>{
                reject(JSON.stringify(error));
            })
    })
}


function partialPayment(tableId,price,paymentType ) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: tableId,
            },
            include: [{
                model:mPayment
            }]
        }).then(tablePayment=> {
            console.log(JSON.stringify(tablePayment));
            if (price > tablePayment.totalPrice ){
                reject('The money which is taken cannot be higher than total price!');
            }else{
                mPayment.create({price,paymentType,tableId}).then(myData=>{
                }).catch(error=>{
                    reject(error);
                })
                var total=tablePayment.totalPrice;
                total-= price;
                var currentStatus=2;
                if (total==0){
                    currentStatus=1;
                }
                mTable.update(
                    {
                        totalPrice: total,
                        status:currentStatus
                    },
                    {
                        where:{
                            id:tableId
                        }
                    })
            }
            resolve(JSON.stringify(total + " TL left"));
        })
            .catch(error => {
                reject(error);
            })
    })

}

function getRemaningPayment(tableId) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: tableId,
                status:2
            }
        }).then(result => {
            if (result != undefined && result!= null){
                resolve(JSON.stringify(result));
            }else{
                reject("This table does not have an order now");
            }

        })
            .catch(error => {
                reject(error);
            })
    })
}

module.exports = function (app) {

            app.get('/api/payment/getRemaningPayment/:id', function (request, response) {
                if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                    || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
                {
                    var tableId = request.params.id;
                    tableId = parseInt(tableId);
                    getRemaningPayment(tableId).then(result=> {
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
            app.get('/api/payment/getAllPaymentByTableId/:id', function (request, response) {
                console.log("getAllPaymentByTableId");
                if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                    || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)))
                {

                    var id = request.params.id;
                    console.log(id);
                    getAllPaymentByTableId(id).then(result=> {
                        response.end(result);
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
            app.post('/api/payment/partialPayment', function (request, response) {
                if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                    || checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                    || checkUsersRole.isChef(request.session.roleId)
                ))
                {
                    var data = request.body;
                    partialPayment(data.tableId,data.price,data.paymentType)
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



