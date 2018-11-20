let path = require('path');
let Beverage = require('../Model/Beverage');

module.exports = function(app) {
/*
    app.get('/beverage', function (request, response) {
        console.log('Beverage');
        response.sendFile(path.resolve('../../public/Pages/Beverage.html'));
        //res.end();
    }),
        app.post('/api/:addBeverage/', function (request, response, next) {
            var data = request.body;
    console.log("BURADAAA");

            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();

            var newdate = year + "." + month + "." + day;
            console.log(newdate);
            data.available = true;
            data.price = parseFloat(data.price);

            data.createdAt =newdate;
            data.updatedAt =newdate;

            Beverage.save(data);
            response.end('Beverage Successfully Added!');
            next();
        })
*/
}
