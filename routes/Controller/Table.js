
let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mTable = db.model(dbNames.table);
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);

let checkUsersRole = require('./RoleCheck');
let checkDataType = require('../Util/TypeCheck');

function createATable(data){
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
                    status: data.status,
                    mergedWith: data.mergedWith,
                    userUsername:data.username
                }
        }).then((food)=>{
            if (food[1] == false){
                reject('This table is already added!');
                return;
            }
            resolve("Table is created successfully");
        })
            .catch(error =>{
                reject("Table could not be created!" + error);
            })

    })

}


function updateTable(data){
    return new Promise((resolve, reject) => {
        mTable.update(
            {
                id:data.newId,
                structure:data.structure,
                capacity: data.capacity,
                status:data.status,
                mergedWith:data.mergedWith,
                userUsername:data.username
            }
            ,{
                where:
                    {
                        id: data.id
                    },
            }).then((result)=>{
            console.log(result);
            if(result[0]>0){
                resolve("Table is updated successfully.");
            }else {
                reject("Table could not be updated!");
            }

        }).catch(error =>{
            reject(error);
        })

    })

}


function createAMerge(data){
    data.tableId1 = parseInt(data.tableId1);
    data.tableId2 = parseInt(data.tableId2);
    if (data.tableId1>data.tableId2){
        var temp;
        temp = data.tableId1;
        data.tableId1=data.tableId2;
        data.tableId2 = temp;
    }
    /*
    data.tableId1
    data.tableId2

    */
    return new Promise((resolve, reject) => {
        mTable.update(
            {
                mergedWith:data.tableId2,
            }
            ,{
                where:
                    {
                        id: data.tableId1
                    },
            }).then((result)=>{
            console.log(result);
            if(result[0]>0){
                resolve("Table is updated successfully.");
            }else {
                reject("Table could not be updated!");
            }

        }).catch(error =>{
            reject(error);
        })

    })

}

function updateStatus(data){

    return new Promise((resolve, reject) => {
        mTable.update(
            {
                status:data.status,
            }
            ,{
                where:
                    {
                        id: data.tableId
                    },
            }).then((result)=>{
            console.log(result);
            if(result[0]>0){
                resolve("Table is updated successfully.");
            }else {
                reject("Table could not be updated!");
            }

        }).catch(error =>{
            reject(error);
        })

    })

}


function assignTableToUser(data,id){
        return new Promise((resolve, reject) => {
            mTable.update(data, {
                where:
                    {
                        'id': id
                    }
            }).then((table) => {
                console.log(table[0]);
                if (table[0] > 0) {
                    resolve("Table is updated successfully.");
                } else {
                    reject("Table could not be updated!");
                }

            }).catch(error => {
                reject(error);
            })
        })

}

function createAndAssignTableToUser(data){
    return new Promise((resolve, reject) => {
        mTable.findOrCreate({
            where:
                {
                    username: data.username
                }
        }).then((table)=>{
            console.log(table[0]);

            resolve("Table is created successfully.");
        })
        /*.spread((user, created)=> {
            console.log("CRRRR : " + created);
            console.log(user.get({plain: true}));

        })*/
            .catch(error =>{
                reject("Table could not be created!" + error);
            })

    })

}

function getAllTables(){
    return new Promise((resolve, reject) => {

        mTable.findAll({
                //   attributes: ['foo', 'bar']
            order: [
                ['id', 'ASC'],
                //['name', 'ASC'],
            ],
            }
        ).then(table=>{
            console.log(JSON.stringify(table))
            resolve(table);
        }).catch(error => {
            reject("Cannot get all Tables");
        })
    });
}

exports.isTableExists = function(id){
    return new Promise((resolve, reject) => {

        mTable.findOne({
                id:id
            }
        ).then(table=>{
            //resolve(table[0].id);
            resolve(true);
        }).catch(error => {
            reject(false);
        })
    });
}
exports.isTableOpen = function(id){
    return new Promise((resolve, reject) => {

        mTable.findOne({
                id:id
            }
        ).then(table=>{
            //resolve(table[0].id);
            resolve(true);
        }).catch(error => {
            reject(false);
        })
    });
}

/*
User.findAll({
    include: [{
        model: Project,
        through: {
            attributes: ['createdAt', 'startedAt', 'finishedAt'],
            where: {completed: true}
        }
    }]
});
*/
function getAUserTables(username) {
    return new Promise((resolve, reject) => {
        mUser.findAll({
            where:{
                username:username
            },
            include: [{
                model: mTable,
            }]
        }).then(data=>{
            console.log(data[0].get(0));
            resolve(data[0].get(0));
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}


function getTableMinus() {
    return new Promise((resolve, reject) => {
        mTable.findAll({
            $or: [
                {mergedWith: -1},
                {mergedWith: -2}
                ]
        }).then(data=>{
            console.log(data[0]);
            resolve(data[0]);
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}



function updateMergedTablesToDivide(id){
    return new Promise((resolve, reject) => {
        mTable.update(id, {
            where:
                {
                    id:id,
                    mergedWith: -2
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
    })

}

function divideTables(id) {
    return new Promise((resolve, reject) => {
        var flag = true;
        var mergedTable=-5;
        mTable.findOne({
            where:{
                id:id
            }
        }).then(data=>{
            console.log(data);

            do {
                updateMergedTablesToDivide(data.id).then(()=>{
                    mergedTable=data.mergedWith;
                    data.id=data.mergedWith;
                }).catch(error=>{
                    reject(error);
                })
            }while (mergedTable>0);

            resolve(data);
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}


function getATable(id) {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where:{
                id:id
            }
        }).then(data=>{
            if (data!=null &&data!=undefined){
                resolve(JSON.stringify(data));
            }else{
                reject("There is no table with this id: "+id);
            }
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}




function getUsersTable(data){
    return new Promise((resolve, reject) => {
        mUser.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: mTable,
                where: { userUsername: data.username },
                //, as: 'saves' // <- 'saves' instead of 'savers'
            }, {
                model: mRole,
                through: mUserRoles,
            }
            ]
        }).then(data=> {

            //console.log("1->"+JSON.stringify(data[0].dataValues));
            if (data[0] != null && data[0] != undefined) {
                //  if (data[0].roles.id==5) {
                console.log(JSON.stringify(data));
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

function deleteTable(id){
    return new Promise((resolve,reject)=>{
        mTable.destroy({
            where: {
                id: id
            }
        }).then(dbData=>{
            if(dbData>0){
                resolve('Table is deleted: '+ id);
            }else{
                reject('Table could not be deleted: '+ id);
            }
        }).catch(error =>{
            reject(error + ' Table could not be deleted!');
        })
    })
}


module.exports = function(app){

    app.get('/table', function (request, response) {
        console.log('Table');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                response.sendFile(path.resolve('public/Pages/TableManagement.html'));
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
                }

        //res.end();
    }),
        app.get('/tableCreation', function (request, response) {
            console.log('tableCreation');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                response.sendFile(path.resolve('public/Pages/addTable.html'));
            }
            else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

            //res.end();
        }),
        app.get('/api/table/getTableMinus', function (request, response) {
            console.log('getTablesWithSpefic');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId))
            {

                getTableMinus().then(data => {
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
            }	else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),


        app.post('/api/table/assignTableToUser', function(request,response){
            console.log('assignTableToUser');

            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                var data = request.body;
                var id = parseInt(data.id);
                delete data.id;
                console.log(data);

                assignTableToUser(data, id).then(data => {
                    response.write('Table Successfully Updated!', () => {
                        response.statusCode = 200;
                        response.end();
                    })
                }).catch(error => {
                    response.write(error.toString(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                })
            }	else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
                }

        }),


    app.get('/api/table/getATable/:id', function (request, response) {
        console.log("getATable");
        if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
            ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId))
        {
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
        }else {
            response.statusCode = 401;
            return response.redirect('/noAuthority');
        }

    })

        app.get('/api/table/getUsersTable/:username', function (request, response) {
            console.log("getATableBelongToAUser");
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId))
            {
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
            }else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }

        }),
            app.post('/api/table/updateTable', function (request, response ) {
                var data = request.body;

                if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                    ||  checkUsersRole.isChef(request.session.roleId)
                    ||  checkUsersRole.isMatre(request.session.roleId)))
                {
                    console.log(request);
                    console.log("Will be Updated : " + data);

                    updateTable(data).then(result=> {
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
                }else {
                    response.statusCode = 401;
                    return response.redirect('/noAuthority');
                }


            }),
            app.post('/api/table/createAMerge', function (request, response ) {
                var data = request.body;

                if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                    ||  checkUsersRole.isChef(request.session.roleId)
                    ||  checkUsersRole.isMatre(request.session.roleId)))
                {
                    console.log(request);
                    console.log("Will be Updated : " + data);

                    createAMerge(data).then(result=> {
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
                }else {
                    response.statusCode = 401;
                    return response.redirect('/noAuthority');
                }


            }),
            app.post('/api/table/updateStatus', function (request, response ) {
                var data = request.body;

                if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                    ||  checkUsersRole.isChef(request.session.roleId)
                    ||  checkUsersRole.isMatre(request.session.roleId)))
                {
                    console.log(request);
                    console.log("Will be Updated : " + data);

                    updateStatus(data).then(result=> {
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
                }else {
                    response.statusCode = 401;
                    return response.redirect('/noAuthority');
                }


            }),



    app.get('/api/table/deleteTable/:id', function (request, response ) {

        console.log("Delete Table");
        if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
            ||  checkUsersRole.isAdmin(request.session.roleId))){
            var id= request.params.id;
            deleteTable(id).then(result=> {
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
            /*if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId))
            {
            */if(true){
                    console.log("Get Tables");
                    getAllTables().then(tables => {
                        response.write(JSON.stringify(tables), () => {
                            response.statusCode = 200;
                            console.log(tables);
                            response.end();
                        })
                    }).catch(error => {
                        response.write(error, () => {
                            response.statusCode = 404;
                            response.end();
                        })
                    })
                }	else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }


        }),
            app.post('/api/table/addTable', function (request, response ) {
                console.log("Add Food");
/*
                if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                    ||  checkUsersRole.isChef(request.session.roleId)
                    ||  checkUsersRole.isMatre(request.session.roleId))) {
                    */if(true){
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
                }else {
                    response.statusCode = 401;
                    return response.redirect('/noAuthority');
                }

            })

}


