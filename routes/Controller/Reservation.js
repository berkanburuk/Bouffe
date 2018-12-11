let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;


let db = sequelize();
let dbNames = tableNames();
let mReservation = db.model(dbNames.reservation);
let mTable = db.model(dbNames.table);


function createAReservation(data){
    console.log(data);
        return new Promise((resolve, reject) => {
            mReservation.findOne({
                where:
                    {
                        tableId: data.tableId,
                        reservationDate: data.reservationDate
                    }
            }).then(reservation => {
                console.log("Reservation " + reservation)
                if (reservation == null || reservation == undefined) {
                    mReservation.create(data);
                    resolve("Reservation is created");
                } else {
                    reject("There is already a reservation for table day!");
                }
            }).catch(error => {
                reject(error);
            })
        })
}


function deleteReservation(phoneNumber){

        return new Promise((resolve, reject) => {
            mReservation.destroy({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(reservation => {
                resolve('Reservation is deleted');
            }).catch(error => {
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
            }).then((reservation) => {
                console.log(reservation[0]);
                if (reservation[0] > 0) {
                    resolve("Reservation is updated successfully.");
                } else {
                    reject("Reservation could not updated!");
                }

            }).catch(error => {
                reject(error);
            })

        })
}

//Örnek
function getReservationAndTable(data){
    return new Promise((resolve, reject) => {
        mReservation.findAll({
            where: { phoneNumber: data.phoneNumber },
            include: [{
                model: mTable,
            }]
        }).then(dbData=>{
            if (dbData[0]!= null && dbData[0] != undefined){
                resolve(JSON.stringify(dbData));
            }
            else
                reject("There is no reservation with this phone number: " + data.phoneNumber );
        }).catch(error => {
            reject(error);
        })
    });

}

    module.exports = function(app,session) {

        /*
            app.use('/user', function (req, res, next) {
                if (req.method !== 'GET' || req.url !== '/')
                    return next();
              //  app.use( "/book" , middleware);
                // will match /book
                // will match /book/author
                // will match /book/subject
                // ...
            });
        */
        app.get('/reservation', function (request, response) {
            console.log('Reservation Controller');
            response.sendFile(path.resolve('../../public/Pages/index.html'));
            //response.render(path.resolve('../../public/Pages/index.html'));
        }),

        app.post('/api/reservation/addReservation', function (request, response ) {
            console.log("Add Reservation");
                if (session != undefined &&
                    (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                    var data = request.body;
                    createAReservation(data).then(reservation => {
                        console.log(reservation);
                        response.write(reservation, () => {
                            response.end();
                        })

                    }).catch(error => {
                        console.log(error);
                        response.write(error, () => {
                            response.end();
                        })
                    })
                }
                else {
                    response.write(errorMessage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }

        }),

        app.post('/api/reservation/deleteReservation', function (request, response ) {
            console.log("Delete Reservation");
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                var phoneNumber = request.body;
                deleteReservation(phoneNumber).then(reservation => {
                    console.log(reservation);
                    response.write(reservation, () => {
                        response.end();
                    })

                }).catch(error => {
                    console.log(error);
                    response.write(error, () => {
                        response.end();
                    })
                })
            } else {
                response.write(errorMessage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        })

    app.post('/api/reservation/updateReservation', function (request, response ) {
        console.log("Delete Reservation");
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                var data = request.body;
                updateReservation(data).then(reservation => {
                    console.log(reservation);
                    response.write(reservation.toString(), () => {
                        response.end();
                    })

                }).catch(error => {
                    console.log(error);
                    response.write(error, () => {
                        response.end();
                    })
                })
            }else {
                response.write(errorMessage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

    }),
        app.get('/api/reservation/getReservationAndTable/:phoneNumber', function (request, response) {
            console.log("getReservationAndTable");
            // { phoneNumber: ... }
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                var data = request.params;
                data.phoneNumber = parseInt(data.phoneNumber);
                console.log(data);
                getReservationAndTable(data).then(data => {
                    response.statusCode = 200;
                    console.log(data);
                    response.write(data.toString(), () => {
                        response.end();
                    })
                })
                    .catch(error => {
                        response.statusCode = 404;
                        console.log(error);
                        response.write(error.toString(), () => {
                            response.end();
                        });
                    })
            }else {
                response.write(errorMessage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        })



}
