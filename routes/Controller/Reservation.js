let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;


let db = sequelize();
let dbNames = tableNames();
let mReservation = db.model(dbNames.reservation);

function createAReservation(data){
    //var data = sampleUserData();

    console.log(data);
    return new Promise((resolve, reject) => {
        mReservation.findOne({
            where:
                {
                    tableId: data.tableId,
                    reservationDate: data.reservationDate
                }
        }).then(reservation=>{
            console.log("Reservation " + reservation)
            if (reservation == null || reservation == undefined){
                mReservation.create(data);
                resolve("Reservation is created");
            }else{
                reject("There is already a reservation for table day!");
            }
        }).catch(error =>{
            reject(error);
        })
    })
}

function simpleData(){
    var d = new Date();
    d = d.getFullYear();
    var data = {
        fullName: 'ali kıran',
        phoneNumber: 5554444444,
        reservationDate: d,
        tableId: 1,
        numberOfCustomer: 4
    }
    console.log(data);
    return data;
}

module.exports = function(app) {
    app.get('/reservation', function (request, response) {
        console.log('Reservation Controller');
        response.sendFile(path.resolve('../../public/Pages/index.html'));
        //response.render(path.resolve('../../public/Pages/index.html'));

    }),
        app.get('/api/:reservation/:createAReservation', function (request, response,next) {
            console.log("Create a reservation");
            var data = request.body;

            var data = simpleData();

            createAReservation(data).then(reservation => {
                console.log(reservation);
                response.end(reservation);
            }).catch(error => {
                console.log(error);
                response.end(error);
            })

            next();
        })
}
