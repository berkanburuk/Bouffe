
let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mTable = db.model(dbNames.table);
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);

let checkUsersRole = require('./RoleCheck');


function save(data){
    return new Promise((resolve,reject)=>{
        mTable.create(data).then(data=> {
            console.log(data.get())
            resolve(data);
        }).catch(error => {
            reject(error + 'Cannot create the Table!');
        });
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
//primaryKey  = name olmalı
function deleteTable(username){
    return new Promise((resolve,reject)=>{
        mTable.destroy({
            where: {
                'username': username
            }
        }).then(dbData=>{
            resolve(data + ' Table is deleted');
        }).catch(error =>{
            reject(error + ' Table could not be deleted!');
        })
    })
}


module.exports = function(app,session){

    app.get('/table', function (request, response) {
        console.log('Table');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                response.sendFile(path.resolve('public/Pages/TableManagement.html'));
            }
            else {
                    response.write(checkUsersRole.errorMesage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }

        //res.end();
    }),

        app.post('/api/table/addTable', function(request,response) {
            if (request.session != undefined && (checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId)) {
                console.log('Add Table');
                var data = request.body;
                console.log(data);

                save(data).then((data) => {
                    response.write('Table is created!', () => {
                        response.statusCode = 200;
                        response.end();
                    })
                }).catch(error => {
                    response.write(error.toString(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                })
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),
        app.post('/api/table/assignTableToUser', function(request,response){
            console.log('assignTableToUser');

            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId))
            {
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),

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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        })

        app.get('/api/table/getAllTables', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)) || checkUsersRole.isAdmin(request.session.roleId))
            {
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }


        })

}


