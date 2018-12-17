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


module.exports = function (app) {


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
            app.get('/api/order/getAllPaymentByTableId/:id', function (request, response) {
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
            })


}



