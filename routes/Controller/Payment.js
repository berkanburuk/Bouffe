let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let beverageFunc = require('./Beverage').getBeverage;


let db = sequelize();
let dbNames = tableNames();
let mPayment = db.model(dbNames.payment);


let checkUsersRole = require('./RoleCheck');

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