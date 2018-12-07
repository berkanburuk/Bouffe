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


function deleteReservation(phoneNumber){
    return new Promise((resolve,reject)=>{
        mReservation.destroy({
            where: {
                phoneNumber: phoneNumber
            }
        }).then(reservation=>{
            resolve('Reservation is deleted');
        }).catch(error =>{
            reject("Reservation could not be deleted!");
        })
    })
}


function updateReservation(data){
    return new Promise((resolve, reject) => {
        mReservation.update(data, {
            where:
                {
                    id: data.id
                },
        }).then((reservation)=>{
            console.log(reservation[0]);
            if(reservation[0]>0){
                resolve("Reservation is updated successfully.");
            }else {
                reject("Reservation could not updated!");
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

        app.post('/api/reservation/addReservation', function (request, response ) {
            console.log("Add Reservation");

            var data = request.body;
            createAReservation(data).then(reservation => {
                console.log(reservation);
                response.write(reservation,()=>{
                    response.end();
                })

            }).catch(error => {
                console.log(error);
                response.write(error,()=>{
                    response.end();
                })
            })


        }),

        app.post('/api/reservation/deleteReservation', function (request, response ) {
            console.log("Delete Reservation");
            var phoneNumber = request.body;
            deleteReservation(phoneNumber).then(reservation => {
                console.log(reservation);
                response.write(reservation,()=>{
                    response.end();
                })

            }).catch(error => {
                console.log(error);
                response.write(error,()=>{
                    response.end();
                })
            })


        })

    app.post('/api/reservation/updateReservation', function (request, response ) {
        console.log("Delete Reservation");

        var data = request.body;
        updateReservation(data).then(reservation => {
            console.log(reservation);
            response.write(reservation,()=>{
                response.end();
            })

        }).catch(error => {
            console.log(error);
            response.write(error,()=>{
                response.end();
            })
        })


    })


}
