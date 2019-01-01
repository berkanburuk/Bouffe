let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let checkDataType = require('../Util/TypeCheck');

let db = sequelize();
let dbNames = tableNames();
let mReservation = db.model(dbNames.reservation);
let mTable = db.model(dbNames.table);


let checkUsersRole = require('./RoleCheck');

function createAReservation(data) {
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
                mReservation.create(data).then(() => {
                    resolve("Reservation is created");
                }).catch(error => {
                    reject(error);
                })
            } else {
                reject("There is already a reservation for this table, for this day!");
            }
        }).catch(error => {
            reject(error);
        })
    })
}


function deleteReservation(id) {

    return new Promise((resolve, reject) => {
        mReservation.destroy({
            where: {
                id: id
            }
        }).then(reservation => {
            resolve('Reservation is deleted');
        }).catch(error => {
            reject("Reservation could not be deleted!");
        })
    })
}


function updateReservation(data) {
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
function getReservationAndTable(data) {
    return new Promise((resolve, reject) => {
        mReservation.findAll({
            where: {phoneNumber: data.phoneNumber},
            include: [{
                model: mTable,
            }]
        }).then(dbData => {
            if (dbData[0] != null && dbData[0] != undefined) {
                resolve(JSON.stringify(dbData));
            }
            else
                reject("There is no reservation with this phone number: " + data.phoneNumber);
        }).catch(error => {
            reject(error);
        })
    });

}

function isTableIdExists(id) {

}

//Örnek
function getEmptyTablesForReservation(date) {
    return new Promise((resolve, reject) => {
        var table;
        mTable.findAll({
            attributes: ['id'],
            where: {
                status: {
                    gt: 0
                }
            }
        }).then(tableIds => {
            table = tableIds;
            mReservation.findAll({
                attributes: ['tableId'],
                where: {
                    reservationDate: date
                },
                //raw:true
            }).then(reservedTables => {
                if (!reservedTables.length) {
                    resolve(JSON.stringify(tableIds));
                }
                else {
                    var reserved = reservedTables;
                    //var valuesArray = Object.values(reserved);

                    if (table.length > 0) {
                        var i = 0;
                        var t = [];
                        for (var i = 0; i < table.length; i++) {
                            t.push(table[i].get('id'));
                        }
                        console.log("telllll" + t);
                        for (var i = 0; i < reserved.length; i++) {
                            //if (table[i].get('id') != reserved[i].get('tableId')) {
                            var a = reserved[i].get('tableId');
                            if (t.indexOf(a) > 0) {
                                console.log("Deleting" + i);
                                reservedTables.splice(i, 1);
                            }
                        }
                        resolve(JSON.stringify(reservedTables));
                    } else {
                        reject("Reservation is full for this date : " + date);
                    }
                }

            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        })
    })
    /*

    mReservation.findAll({
        where:
            {
                tableId: null
            }
    }).then(dbData=>{
        console.log(dbData);
        if (dbData!= null && dbData != undefined){
            resolve(JSON.stringify(dbData));
        }
        else
            reject("There is no reservation left!");
    }).catch(error => {
        reject(error);
    })
});
*/
}

function getAllReservation() {
    return new Promise((resolve, reject) => {
        mReservation.findAll({}).then(dbData => {
            if (dbData != null && dbData != undefined) {
                resolve(dbData);
            }
            else
                reject("Could not get all reservations");
        }).catch(error => {
            reject(error);
        })
    });

}



module.exports = function (app) {

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
    app.get('/reservationManagement', function (request, response) {
        console.log('Reservation Controller');
        if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
            || checkUsersRole.isCashier(request.session.roleId))) {
            response.sendFile(path.resolve('public/Pages/makeReservation.html'));
        } else {
            response.statusCode = 401;
            return response.redirect('/noAuthority');
        }

    }),

        app.post('/api/reservation/addReservation', function (request, response) {
            console.log("Add Reservation");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId))) {
                var data = request.body;
                //if (checkDataType.)
                createAReservation(data).then(reservation => {
                    console.log(reservation);
                    response.write(reservation, () => {
                        response.end();
                    })

                }).catch(error => {
                    console.log(error);
                    response.write(error.toString(), () => {
                        response.end();
                    })
                })
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        }),

        app.get('/api/reservation/deleteReservation/:id', function (request, response) {
            console.log("Delete Reservation");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId))) {
                var id = request.params.id;
                deleteReservation(id).then(reservation => {
                    console.log(reservation);
                    response.write(reservation, () => {
                        response.end();
                    })
                }).catch(error => {
                    console.log(error);
                    response.write(error.toString(), () => {
                        response.end();
                    })
                })
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        })

    app.post('/api/reservation/updateReservation', function (request, response) {
        console.log("Delete Reservation");
        if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
            || checkUsersRole.isCashier(request.session.roleId))) {
            var data = request.body;
            updateReservation(data).then(reservation => {
                console.log(reservation);
                response.write(reservation.toString(), () => {
                    response.end();
                })

            }).catch(error => {
                console.log(error);
                response.write(error.toString(), () => {
                    response.end();
                })
            })
        } else {
            response.statusCode = 401;
            return response.redirect('/noAuthority');
        }

    }),
        app.get('/api/reservation/getReservationAndTable/:phoneNumber', function (request, response) {
            console.log("getReservationAndTable");
            // { phoneNumber: ... }
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId))) {
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
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        }),
        app.post('/api/reservation/getNotReservedTable', function (request, response) {
            console.log("getReservationAndTable");

            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId))) {
                var data = request.body;
                getEmptyTablesForReservation(data.date).then(data => {
                    response.statusCode = 200;
                    response.write(data, () => {
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
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        }),
        app.get('/api/reservation/getAllReservation', function (request, response) {
            console.log("getReservationAndTable");

            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId))) {

                getAllReservation().then(data => {
                    response.statusCode = 200;
                    response.write(JSON.stringify(data), () => {
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
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        })


}
