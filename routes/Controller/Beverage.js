let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mBeverage = db.model(dbNames.beverage);



const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mBeverage.create(data).then(beverage=> {
            console.log(beverage[0].get(0))
            resolve("Beverage is created.");
        }).catch(error => {
            reject(error + 'Cannot create the Beverage!');
        });
    })
}

module.exports = function(app) {

    app.get('/beverage', function (request, response) {
        console.log('Beverage');
        response.sendFile(path.resolve('../../public/Pages/Beverage.html'));
        //res.end();
    }),
        app.post('/api/:beverage/:addBeverage/', function (request, response, next) {
            var data = request.body;
            console.log("Beverage Controller");
            save(data).then(beverage=>{
                response.end(beverage);
            }).catch(error=>{
                response.end(error);
            })
            next();
        })

}
