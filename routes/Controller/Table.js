let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mTable = db.model(dbNames.table);
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);
let mOrder = db.model(dbNames.order);
let mOrderTable = db.model(dbNames.orderTable);

let mReservation = db.model(dbNames.reservation);

let checkUsersRole = require('./RoleCheck');
let checkDataType = require('../Util/TypeCheck');


function createATable(data) {
    return new Promise((resolve, reject) => {
        mTable.findOrCreate({
            where:
                {
                    id: data.id
                },
            defaults:
                {
                    structure: data.structure,
                    capacity: data.capacity,
                    status: 1,
                    mergedWith: data.mergedWith,
                    userUsername: data.userUsername
                }
        }).then((food) => {
            if (food[1] == false) {
                reject('This table is already added!');
                return;
            }
            resolve("Table is created successfully");
        })
            .catch(error => {
                reject("Table could not be created!" + error);
            })

    })

}

function updateTable(data) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: data.newId
            }
        }).then(myData => {
            if (myData != null || myData != undefined) {
                reject("There is already a table with id: " + data.newId)
                return;
            }

            mTable.update(
                {
                    id: data.newId,
                    structure: data.structure,
                    capacity: data.capacity,
                    //status:data.status,
                    mergedWith: data.mergedWith,
                    userUsername: data.username
                }
                , {
                    where:
                        {
                            id: data.id
                        },
                }).then((result) => {
                if (result[0] > 0) {
                    resolve("Table is updated successfully.");
                } else {
                    reject("Table could not be updated!");
                }
            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        })
    })

}

function findIfMergedWithAnother(tableId1, tableInfo2) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: tableId1
            }
        }).then(tableInfo1 => {
            if (tableInfo1.mergedWith > -2) {

            }
        }).catch(error => {
            reject(error)
        })

    })
}

function createAMergeNew(data) {
    /*
    data.tableId1
    data.tableId2
    */
    return new Promise((resolve, reject) => {
        console.log("Data 1 : " + data.tableId1 + "\n" + "Data 2: " + data.tableId2)
        mTable.findOne({
            where: {
                id: data.tableId2
            }
        }).then(tableId2 => {
            if (tableId2.status == 0) {
                reject("Activate the table first!");
            } else if (tableId2.status == 2) {
                reject("A table which has a order cannot be merged!");
            }
            else {
                data.tableId1 = parseInt(data.tableId1);
                data.tableId2 = parseInt(data.tableId2);
                if (data.tableId1 > data.tableId2) {
                    var temp;
                    temp = data.tableId1;
                    data.tableId1 = data.tableId2;
                    data.tableId2 = temp;
                }

                mTable.update(
                    {mergedWith: data.tableId2},
                    {
                        where:
                            {
                                id: data.tableId1
                            },
                    })
                    .then((result) => {
                        mTable.update(
                            {mergedWith: -1},
                            {
                                where:
                                    {
                                        id: data.tableId2
                                    }
                            }).then((result) => {
                            if (result[0] > 0) {
                                resolve("Table is merged successfully.");
                            } else {
                                reject("Table could not be updated!");
                            }

                        }).catch(error => {
                            reject(error);
                        })

                    }).catch(error => {
                    reject(error);
                })
            }
        })


    })
}

function createAMerge(data) {
    /*
    data.tableId1
    data.tableId2

    */
    return new Promise((resolve, reject) => {
        console.log("Data 1 : " + data.tableId1 + "\n" + "Data 2: " + data.tableId2)
        mTable.findOne({
            where: {
                id: data.tableId2
            }
        }).then(tableId2 => {
            if (tableId2.status == 0) {
                reject("Activate the table first!");
            } else if (tableId2.status == 2) {
                reject("A table which has a order cannot be merged!");
            }
            else {
                data.tableId1 = parseInt(data.tableId1);
                data.tableId2 = parseInt(data.tableId2);
                if (data.tableId1 > data.tableId2) {
                    var temp;
                    temp = data.tableId1;
                    data.tableId1 = data.tableId2;
                    data.tableId2 = temp;
                }
                mTable.update(
                    {mergedWith: data.tableId2},
                    {
                        where:
                            {
                                id: data.tableId1
                            },
                    })
                    .then((result) => {
                        mTable.update(
                            {mergedWith: -1},
                            {
                                where:
                                    {
                                        id: data.tableId2
                                    }
                            }).then((result) => {
                            if (result[0] > 0) {
                                resolve("Table is merged successfully.");
                            } else {
                                reject("Table could not be updated!");
                            }

                        }).catch(error => {
                            reject(error);
                        })

                    }).catch(error => {
                    reject(error);
                })
            }
        })


    })
}

function updateStatus(data) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: data.tableId,
                status: {
                    lt: 2
                }
            }
        }).then(table => {
            console.log(JSON.stringify(table));
            if (table != null && table != undefined) {
                mTable.update(
                    {
                        status: data.status,
                    }
                    , {
                        where:
                            {
                                id: data.tableId,
                                mergedWith: -2
                                /*
                                status:{
                                    ne:1
                                }
                                */
                            },
                    }).then((result) => {
                    if (result[0] > 0) {
                        resolve("Table is updated.");
                    } else {
                        reject("Table could not be updated!\nDivide the table first!");
                    }

                }).catch(error => {
                    reject(error);
                })
            } else {
                reject("To be able to Deactivate a table, PAYMENT MUST BE DONE.");
            }
        }).catch(error => {
            resolve(error);
        })


    })

}


function shiftOrderedTable(userUsername, oldTableId, newTableId) {
    //newTableId status 1 ise yap -> Order al, update et,
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: newTableId
            }
        }).then(newTable => {
            if (newTable.id == 1) {
                //
            } else {
                reject("Table cannot be shifted to a table which has an orders!");
            }
        })
            .catch(error => {
                reject(error);
            })
    })
}

function assignWaiterToTable(userUsername, oldTableId, newTableId) {
    return new Promise((resolve, reject) => {
        mTable.update(
            {
                userUsername: userUsername
            },
            {
                where:
                    {
                        tableId: newTableId,
                        status: 1
                    }
            }).then((table) => {
            if (table > 0) {
                resolve("User is assigned to Table");
            } else {
                reject("User could not be assigned to Table!");
            }
        }).catch(error => {
            reject("Valid parameters shall be sent!\n" + error);
        })
    })
}

function swapTable(userUsername, oldTableId, newTableId,orderId) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where:{
                id:newTableId,
                status:1
            }
        }).then(data=> {
            if (data != undefined && data != undefined) {
                mOrderTable.update(
                    {
                        tableId: newTableId
                    },
                    {
                        where:
                            {
                                tableId: oldTableId,
                                orderId: orderId
                            }
                    }).then((table) => {
                    if (table > 0) {
                        resolve("User is assigned to Table");
                    } else {
                        reject("Table could not be swaped!");
                    }
                }).catch(error => {
                    reject("Valid parameters shall be sent!\n" + error);
                })
            } else {
                reject("Swapped table's status can only be 1!!")
            }
        }).catch(error=>{
            reject(error)
        })
        })


}
function releaseTableFromUser(userUsername, tableId) {
    return new Promise((resolve, reject) => {
        mTable.update(
            {
                userUsername: userUsername
            },
            {
                where:
                    {
                        tableId: tableId,
                        status: 1
                    }
            }).then((table) => {
            if (table > 0) {
                resolve("User is not responsible from this table " + tableId + " anymore");
            } else {
                reject("This table has orders, you cannot release a waiter from this table " + tableId);
            }
        }).catch(error => {
            reject("Valid parameters shall be sent!\n" + error);
        })
    })
}


function shiftManagement(userUsername, oldTableId, newTableId) {
    //newTableId statusü 1 olmalı kesinlikle
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: newTableId,
                status: 1
            }
        }).then(newTable => {
            if (newTable != null && newTable != undefined) {
                mTable.update(
                    {},
                    {}
                )

            } else if (oldTable.status == 2) {
                shiftOrderedTable(userUsername, oldTableId, newTableId);
            }
            resolve("Table is shifted");
        }).catch(error => {
            reject(error);
        })
    })

}

function swapTables(data) {
    /*
    userUsername,oldTableId,newTableId
         gerekirse gönderilebilir, ona göre update edilebilir.
     */

    return new Promise((resolve, reject) => {
        console.log(data)
        mTable.findOne({
            where: {
                id: data.oldTableId,
                status: 2,
            }
        }).then(oldTable => {
            console.log(JSON.stringify(oldTable))
            if (oldTable == null || oldTable == undefined) {
                reject("This table cannot be shifted!")
            } else {
                mTable.findAll({
                    where: {
                        id: data.newTableId,
                        status: 1,
                    },
                    include:
                        [
                            {
                                model: mOrder,
                                through: mOrderTable,
                                where: {
                                    orderOpen: true
                                }
                            }
                        ]
                }).then((order) => {
                    resolve(JSON.stringify(order));
                    console.log(JSON.stringify(order))
                }).catch(error => {
                    reject(error);
                })
            }
        })
            .catch(error => {
                reject(error)
            })
    })
}

function getAllTablesYedek() {
    return new Promise((resolve, reject) => {

        mTable.findAll({
                //   attributes: ['foo', 'bar']
                order: [
                    ['id', 'ASC'],
                    //['name', 'ASC'],
                ],
            }
        ).then(table => {
            resolve(table);
        }).catch(error => {
            reject("Cannot get all Tables");
        })
    });
}

function getAllTables() {
    return new Promise((resolve, reject) => {

        mTable.findAll({
                //   attributes: ['foo', 'bar']
                order: [
                    ['id', 'ASC'],
                    //['name', 'ASC'],
                ], /*
            where:{
                mergedWith:{
                    ne:-1
                }
            }*/
            }
        ).then(table => {
            resolve(table);
        }).catch(error => {
            reject("Cannot get all Tables");
        })
    });
}

exports.isTableExists = function (id) {
    return new Promise((resolve, reject) => {

        mTable.findOne({
                id: id
            }
        ).then(table => {
            //resolve(table[0].id);
            resolve(true);
        }).catch(error => {
            reject(false);
        })
    });
}

function isTableOrderable(id) {
    return new Promise((resolve, reject) => {


        mTable.findAll({
            where: {
                structure: 'Square',
                mergedWith: {
                    lt: -1
                },
                status: 1,
                id: {
                    ne: id
                }
            }
        })
            .then(data => {
                if (data != undefined || data != null)
                    resolve(JSON.stringify(data));
                else {
                    reject("There is no table as you want");
                }
            }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}

function getMyTables(username) {
    return new Promise((resolve, reject) => {
        mTable.findAll({
            order: [
                ['id', 'ASC'],
                //['name', 'ASC'],
            ],
            where: {
                userUsername: username
            }
        })
            .then(data => {
                if (data != undefined || data != null)
                    resolve(JSON.stringify(data));
                else {
                    reject("You do not have a table");
                }
            }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}

function divideTables(data) {

    return new Promise((resolve, reject) => {
        for (var key in data) {
            var id = data[key];
            mTable.update({
                    mergedWith: -2
                },
                {
                    where:
                        {
                            id: id
                        }
                }).then((table) => {
                console.log(table);
                console.log(table[0]);
                if (table[0] > 0) {
                    resolve("Table is updated successfully.");
                } else {
                    reject("Table could not be updated!");
                }

            }).catch(error => {
                reject(error);
            })
        }
    })
}

function getATable(id) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: id
            }
        }).then(data => {
            if (data != null && data != undefined) {
                resolve(JSON.stringify(data));
            } else {
                reject("There is no table with this id: " + id);
            }
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}


function getUsersTable(data) {
    return new Promise((resolve, reject) => {
        mUser.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: mTable,
                where: {userUsername: data.username},
                //, as: 'saves' // <- 'saves' instead of 'savers'
            }, {
                model: mRole,
                through: mUserRoles,
            }
            ]
        }).then(data => {

            //console.log("1->"+JSON.stringify(data[0].dataValues));
            if (data[0] != null && data[0] != undefined) {
                //  if (data[0].roles.id==5) {

                resolve(JSON.stringify(data));
                /*
                 }else{
                     reject("Only Waiter can get tables!");
                 }*/
            }
            else
                reject("User does not have any table assigned!");
        })

    }).catch(error => {
        reject(error + " Cannot get all Tables Related to this ");
    })
}

/*
function getAllReservation(data) {
    console.log("getAllReservation")
    return new Promise((resolve, reject) => {
        mReservation.findAll({
            where:{
                tableId:{
                    contains:data
                }
            }
        }).then(dbData => {
            if (dbData != null && dbData != undefined) {
                resolve(true);
            }
            else
                resolve(false)
        }).catch(error => {
            reject(error);
        })
    })
}

function checkIfTableHasReservation() {
    return new Promise((resolve, reject) => {
        console.log("checkIfTableHasReservation")
            mTable.findAll({
                attributes:['id']
            }).then(d => {
                    JSON.stringify(d)
                JSON.stringify(d[0])
                    getAllReservation(d[0]).then(data => {
                        if (data == true)
                        reject("Table has reservation(s), delete them first!")
                        else{
                            resolve(true)
                        }
                    }).catch(error => {
                        reject(error);
                    })
            }).catch(error => {
                    reject(error);
                })
        })
}
*/
function deleteTable(id) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                id: id,
                mergedWith: -2,
                status: {
                    lt: 2
                }
            }
        }).then(table => {
            if (table != null || table != undefined) {
                table.id

                mTable.destroy({
                    where: {
                        id: id
                    }
                }).then(dbData => {
                    if (dbData > 0) {
                        resolve('Table is deleted: ' + id);
                    } else {
                        reject('Table could not be deleted: ' + id);
                    }
                }).catch(error => {
                    reject('Table has reservation(s), delete them first!');
                })
            } else {
                reject("Cannot be deleted!\nTable is merged with another table or has unpaid check!")
            }
        }).catch(error => {
            reject(error)
        }).catch(error => {
            reject(error)
        })
    })
}


module.exports = function (app) {

    app.get('/tableLayoutManagement', function (request, response) {
        console.log('Table');
        if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
            || checkUsersRole.isAdmin(request.session.roleId))) {
            response.sendFile(path.resolve('public/Pages/tableLayoutManagement.html'));
        }
        else {
            response.statusCode = 401;
            return response.redirect('/noAuthority');
        }

        //res.end();
    }),
        app.get('/tableManagement', function (request, response) {
            console.log('tableCreation');
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId))) {
                response.sendFile(path.resolve('public/Pages/addTable.html'));
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

            //res.end();
        }),
        app.get('/api/table/getTableMinus/:id', function (request, response) {
            console.log('getTableMinus');
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                var id = request.params.id;
                isTableOrderable(id).then(data => {
                    response.write(JSON.stringify(data), () => {
                        response.statusCode = 200;
                        response.end();
                    })
                }).catch(error => {
                    response.write(error.toString(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                })
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),


        app.get('/api/table/getATable/:id', function (request, response) {
            console.log("getATable");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                var id = request.params.id;

                getATable(id).then(data => {
                    response.statusCode = 200;
                    console.log(data);
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

        })
    app.get('/api/table/getMyTables', function (request, response) {
        console.log("getATable");
        if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
            || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
            var username = request.session.username;
            getMyTables(username).then(data => {
                response.statusCode = 200;
                console.log(data);
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

    })

    app.get('/api/table/getUsersTable/:username', function (request, response) {
        console.log("getATableBelongToAUser");
        if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
            || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
            var username = request.params;
            console.log(username);
            getUsersTable(username).then(data => {
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
        app.post('/api/table/updateTable', function (request, response) {
            var data = request.body;

            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                var data = request.body;
                if (!checkDataType.isObjectValuesEmpty(data)) {
                    response.statusCode = 404;
                    response.write(checkDataType.errorMesageEmpty(), () => {
                        //response.statusCode = 400;
                        response.end();
                    })
                    return false;
                } else {
                    updateTable(data).then(result => {
                        response.statusCode = 200;
                        console.log(result);
                        response.write(JSON.stringify(result), () => {
                            response.end();
                        })
                    }).catch(error => {
                        response.statusCode = 404;
                        console.log(error);
                        response.write(error.toString(), () => {
                            response.end();
                        })
                    })
                }
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }


        }),
        app.post('/api/table/createAMerge', function (request, response) {
            var data = request.body;
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                if (checkDataType.isNumber(parseInt(data.tableId1)) && checkDataType.isNumber(parseInt(data.tableId2))) {
                    createAMerge(data).then(result => {
                        response.statusCode = 200;
                        console.log(result);
                        response.write(JSON.stringify(result), () => {
                            response.end();
                        })
                    }).catch(error => {
                        response.statusCode = 404;
                        console.log(error);
                        response.write(error.toString(), () => {
                            response.end();
                        })
                    })
                } else {
                    response.statusCode = 404;
                    response.write(checkDataType.errorMesageEmpty(), () => {
                        response.end();
                    })
                }
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }


        }),
        app.post('/api/table/updateStatus', function (request, response) {
            var data = request.body;
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                if (checkDataType.isObject(data)) {
                    updateStatus(data).then(result => {
                        response.statusCode = 200;
                        console.log(result);
                        response.write(JSON.stringify(result), () => {
                            response.end();
                        })
                    }).catch(error => {
                        response.statusCode = 404;
                        console.log(error);
                        response.write(error.toString(), () => {
                            response.end();
                        })
                    })
                } else {
                    response.statusCode = 404;
                    console.log(error);
                    response.write(checkDataType.errorMesage(), () => {
                        response.end();
                    })
                }
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        }),


        app.get('/api/table/deleteTable/:id', function (request, response) {

            console.log("Delete Table");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                var id = request.params.id;
                deleteTable(id).then(result => {
                    response.statusCode = 200;
                    console.log(result);
                    response.write("Successful", () => {
                        response.end();
                    });
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);
                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }


        }),

        app.post('/api/table/divideTable', function (request, response) {

            console.log("Divide Table");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                var data = request.body;
                console.log("divideTable" + data);
                divideTables(data).then(result => {
                    response.statusCode = 200;
                    console.log(result);
                    response.write("Successful", () => {
                        response.end();
                    });
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);
                    response.write(error, () => {
                        response.end();
                    });
                })
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }


        }),


        app.get('/api/table/getAllTables', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isWaiter(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {

                console.log("Get Tables");
                getAllTables().then(tables => {
                    response.write(JSON.stringify(tables), () => {
                        response.statusCode = 200;
                        response.end();
                    })
                }).catch(error => {
                    response.write(error, () => {
                        response.statusCode = 404;
                        response.end();
                    })
                })
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }


        }),
        app.post('/api/table/addTable', function (request, response) {
            console.log("addTable");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isCashier(request.session.roleId)
                || checkUsersRole.isAdmin(request.session.roleId))) {
                var data = request.body;
                if (!checkDataType.isObjectValuesEmpty(data)) {
                    response.statusCode = 404;
                    response.write(checkDataType.errorMesageEmpty(), () => {
                        //response.statusCode = 400;
                        response.end();
                    })
                    return false;
                } else {
                    createATable(data).then(food => {
                        response.statusCode = 200;
                        console.log(food);
                        response.write(JSON.stringify(food), () => {
                            response.end();
                        })

                    }).catch(error => {
                        console.log(error);
                        response.statusCode = 404;
                        response.write(error.toString(), () => {
                            response.end();
                        })
                    })
                }
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        }),
        app.post('/api/table/swapTables', function (request, response) {
            console.log("swapTables");
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId) || checkUsersRole.isAdmin(request.session.roleId))) {
                swapTables(request.body).then(food => {
                    response.statusCode = 200;
                    console.log(food);
                    response.write(JSON.stringify(food), () => {
                        response.end();
                    })
                }).catch(error => {
                    console.log(error);
                    response.statusCode = 404;
                    response.write(error.toString(), () => {
                        response.end();
                    })
                })
            } else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        })


}


