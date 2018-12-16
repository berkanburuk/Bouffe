let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let beverageFunc = require('./Beverage').getBeverage;


let db = sequelize();
let dbNames = tableNames();
let mPayment = db.model(dbNames.payment);


let checkUsersRole = require('./RoleCheck');


function getAllPaymentByTableId(id){

        return new Promise((resolve, reject) => {
            mPayment.findAll({
                where: {
                    name: data.menuName
                },
                include: [
                    {
                        model:mFood,
                        through: mMenuFood
                    }
                ]
            }).then(result=>{
                resolve(JSON.stringify(result));
            }).catch(error=>{
                reject(JSON.stringify(error));
            })
    })
}


exports.isExists = function(id) {
    return new Promise((resolve, reject) => {
        mPayment.findOne({
            where:
                {
                    id: id
                }
        })
        .then(dbData=>{
                if (dbData!= null && dbData != undefined){
                    resolve(true);
                }
                else{
                    reject("There is no payment with this id: " + id);
                }
        })
            .catch(error =>{
                reject(false);
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
        })


}



