let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let beverageFunc = require('./Beverage').getBeverage;


let db = sequelize();
let dbNames = tableNames();
let mPayment = db.model(dbNames.payment);


exports.isExists = function(id) {
    return new Promise((resolve, reject) => {
        mPayment.findOne({
            where:
                {
                    id: id
                }
        }).then((payment)=>{
            resolve(true);
        })
            .catch(error =>{
                reject(false);
            })

    })
}