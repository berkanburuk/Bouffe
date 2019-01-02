let path = require('path');

let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let mUserFunc = require('../Util/DatabaseConnection').getUserModel;

let checkUsersRole = require('./RoleCheck');
let checkDataType = require('../Util/TypeCheck');

/*
let transaction;
try {
    // get transaction
    transaction = await sequelize.transaction();
    // step 1
    await Model.destroy({where: {id}, transaction});
    // step 2
    await Model.create({}, {transaction});
    // commit
    await transaction.commit();
} catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback();
}
*/


let db = sequelize();
let dbNames = tableNames();
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);
let mTable = db.model(dbNames.table);
let mUserRoles = db.model(dbNames.userRoles);

module.exports = function(app) {

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


    app.get('/user', function (request, response) {
        console.log('User Controller');
                response.sendFile(path.resolve('public/Pages/login.html'));

    }),

        app.get('/userManagement', function (request, response) {
            console.log('UploadSRSFile');
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId))){
                response.sendFile(path.resolve('public/Pages/uploadSRSFile.html'));
            }else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),

        app.get('/chefManagement', function (request, response) {
            console.log('chef');
            if (request.session != undefined  && (checkUsersRole.isChef(request.session.roleId))){
                response.sendFile(path.resolve('public/Pages/chef.html'));
            }else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),

        app.get('/navigation', function (request, response) {
            console.log('Navigation');
            if (request.session != undefined  && (
                checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId)
                ||  checkUsersRole.isWaiter(request.session.roleId)
                ||  checkUsersRole.isBartender(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId)))
            {
                response.sendFile(path.resolve('public/Pages/navigation.html'));
            }else {
                response.statusCode = 401;
                //response.sendFile(path.resolve('public/Pages/login.html'));
                return response.redirect('/user');
            }
        }),

        app.get('/pdfGenerator', function (request, response) {
            console.log('PdfGenerator');
            if (request.session != undefined  &&
                (checkUsersRole.isMatre(request.session.roleId)
                    ||  checkUsersRole.isAdmin(request.session.roleId)
                    ||  checkUsersRole.isCashier(request.session.roleId)))
            {
                response.sendFile(path.resolve('public/Pages/pdfGenerator.html'));
            }else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),
        app.get('/bartenderManagement', function (request, response) {
            console.log('BartenderManagement');
            if (request.session != undefined  &&
                (checkUsersRole.isBartender(request.session.roleId)))
            {
                response.sendFile(path.resolve('public/Pages/bartender.html'));
            }else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),
        app.get('/api/user/deleteUser/:username', function (request, response ) {

            console.log("Delete USER");
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId))){

                var username = request.params.username;

                deleteUser(request.session.username,username).then(user => {

                    response.statusCode = 200;
                    console.log(user);
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

        //checkUser
        app.get('/api/user/login/:username/:password', function (request, response) {

            console.log(request.params);
            var data = {}
            data.username = request.params.username;
            data.password = request.params.password;
            data.username = data.username.toLowerCase();
            data.username = data.username.trim();
            //var data = request.body;
            console.log(request.body);
            checkValidationOfUser(data.username, data.password).then(user => {
                console.log(data);

                getAUserRole(data.username).then(role => {
                    response.statusCode = 200;
                    var myRole = JSON.parse(role);
                    request.session.username = data.username;
                    request.session.roleId = myRole[0].roleId;

                    console.log("Session: " + request.session.username + request.session.roleId);

                    return response.redirect('/navigation');


                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);
                    response.write("This user does not have an roleId", () => {
                        response.end();
                    });
                })
            }).catch(error => {
                response.statusCode = 404;
                console.log(error);
                response.write(error.toString(), () => {
                    response.end();
                });
            })
        }),

        app.post('/api/user/addUser', function (request, response) {
            console.log("Create A User");
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId))){

                var dataArray = request.body;

                for(var i=0;i<dataArray.data.length;i++) {
                    if (checkDataType.isObjectValuesEmpty(dataArray.data[i])) {
                        dataArray.data[i].roleId = parseInt(dataArray.data[i].roleId, 10);
                        dataArray.data[i].courseId = parseInt(dataArray.data[i].courseId, 10);
                        dataArray.data[i].bilkentId = parseInt(dataArray.data[i].bilkentId, 10);
                        dataArray.data[i].username = dataArray.data[i].username.toLowerCase()
                        dataArray.data[i].username = dataArray.data[i].username.trim()
                    }
                    else {
                        response.statusCode = 404;
                        response.write(checkDataType.errorMesageEmpty().toString(), () => {
                            response.end();
                        });
                        return;
                    }
                }
                        createAUser(dataArray,0,dataArray.data.length).then(user => {
                            response.statusCode = 200;
                            console.log(user);

                            response.write("User is added successfully", () => {
                                response.end();
                            });
                        }).catch(error => {
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
        app.post('/api/user/updateAUser', function (request, response) {
            console.log("Update A User");
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
                var data = request.body;
                data.bilkentId = parseInt(data.bilkentId);
                updateAUser(data).then(user => {
                    response.statusCode = 200;
                    console.log(user.toString());
                    response.send(user);
                }).catch(error => {
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



        app.get('/api/user/getAllUsers', function (request, response) {

            console.log("Get all Users");

            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
                getAllUsers().then(user => {
                    response.statusCode = 200;
                    console.log(user);
                    response.write(user, () => {
                        response.end();
                    })
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);

                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }		else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        })

    app.get('/api/user/getRole', function (request, response) {
        var a = request.session;
        console.log("getRole "+JSON.stringify(a));
        if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
            ||  checkUsersRole.isAdmin(request.session.roleId)||  checkUsersRole.isCashier(request.session.roleId)||
            checkUsersRole.isChef(request.session.roleId)||
            checkUsersRole.isBartender(request.session.roleId)||  checkUsersRole.isWaiter(request.session.roleId))){

            response.statusCode = 200;
            var data = JSON.stringify(request.session.roleId);
            response.write(data, () => {
                response.end();
            })
        }else {
            response.statusCode = 401;
            return response.redirect('/noAuthority');
        }
    }),

        app.get('/api/user/getRoleWithId/:id', function (request, response) {
            console.log("getRoleWithId");
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
                var id = request.params.id;
                getRoleWithId(id).then(res=> {
                    response.statusCode = 200;
                    response.write(res, () => {
                        response.end();
                    })
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);

                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }		else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),

        app.get('/api/user/logout', function (request, response) {
            console.log("logout");

            if (request.session!=undefined || request.session!=null){
                request.session.destroy();
                response.statusCode = 200;
                //redirect
                return response.redirect('/user');

            }else {
                response.statusCode = 301;
                return response.redirect('/user');
            }

        }),
        app.get('/api/user/getRoleByUsername/:username', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
                var username = request.params.username;
                getAUserRole(username).then(res=> {
                    response.statusCode = 200;
                    response.write(res, () => {
                        response.end();
                    })
                    //
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);

                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }		else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),
        app.get('/api/user/getAllRoles', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){

                getAllRoles().then(res=> {
                    response.statusCode = 200;
                    response.write(res, () => {
                        response.end();
                    })
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);

                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }		else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        }),
        app.get('/api/user/getRoleObject', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId))){
                getRoleObject().then(res=> {
                    response.statusCode = 200;
                    response.write(res, () => {
                        response.end();
                    })
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);

                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }		else {
                response.statusCode = 401;
                return response.redirect('/noAuthority');
            }
        })



}

/*
  app.get('/api/:user/:addARole', function (request, response,next) {
  addARole('a').then(data => {
      console.log(data);
  }).catch(error=>{
      console.log(error);
  })
      next();
})
*/




function createUserTransaction(data) {
    return sequelize.transaction(function (t) {
        return mUser.create({
            username: data.username,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            bilkentId: data.bilkentId,
        }, {transaction: t}).then(user=> {
            //return (user[0].addRoles(data.roleId),{transaction t});


            return user.setShooter({
                firstName: 'John',
                lastName: 'Boothe'
            }, {transaction: t});
        });
    }).then(function (result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(function (err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
    });
}

function createAUser(jsonArray,startPoint,size){
    return new Promise((resolve, reject) => {
        mUser.findOne({
            where:{
                bilkentId:jsonArray.data[startPoint].bilkentId
            }
        }).then(myData =>{
            if (myData != undefined || myData != null){
                reject("Bilkent Id must be unique")
            }else{
                mUser.findOrCreate({
                    where:
                        {
                            username: jsonArray.data[startPoint].username
                        },
                    defaults:
                        {
                            password: jsonArray.data[startPoint].password,
                            firstName: jsonArray.data[startPoint].firstName,
                            lastName: jsonArray.data[startPoint].lastName,
                            bilkentId: jsonArray.data[startPoint].bilkentId
                        }
                }).then((user)=>{
                    console.log("User" + user[1]);
                    if (user[1] == false){
                        reject('This user is already added!');
                    }
                    user[0].addRoles(jsonArray.data[startPoint].roleId).then(()=>{
                        console.log("Role is added!");
                    }).catch(error=>{
                        reject("Course could not be created!");
                    })
                    user[0].addCourses(jsonArray.data[startPoint].courseId).then(()=>{
                        console.log("Course is added!");
                    }).catch(error=>{
                        reject("Course could not be created!");
                    })
                    startPoint++;
                    console.log("startPoint"+startPoint+"\nSize"+size)
                    if (startPoint<size){
                        resolve(createAUser(jsonArray,startPoint,size))
                    }else{
                        resolve("User(s) are created successfully.");
                    }
                })
                /*.spread((user, created)=> {
                    console.log("CRRRR : " + created);
                    console.log(user.get({plain: true}));
                })*/
                    .catch(error =>{
                        reject("User cannot be created!" + error);
                    })
            }
        }).catch(error=>{
            reject(error)
        })



    })

}

function updateAUser(data){
    return new Promise((resolve, reject) => {
        mUser.findOne({
            where: {
                bilkentId: data.bilkentId
            }
        }).then(myData => {
            if (myData != undefined || myData != null) {
                reject("Bilkent Id must be unique")
            } else {
                mUser.update(
                    {
                        password: data.password,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        bilkentId: data.bilkentId
                    }
                    , {
                        where:
                            {
                                username: data.username
                            },
                    }).then((user) => {
                    mUser.findOne({
                        where: {
                            username: data.username
                        }
                    }).then(user => {
                        user.setRoles(data.roleId).then(roles => {

                        }).catch(error => {
                            reject(error);
                        })
                        user.setCourses(data.courseId).then(courses => {

                        }).catch(error => {
                            reject(error);
                        })
                        resolve("User is updated successfully.");
                    })
                        .catch(error => {
                            reject(error);
                        })
                })
                    .catch(error => {
                        reject(error);
                    })
            }
        }).catch(error => {
            reject(error)
        })
    })

}

function setARole(data){
    return new Promise((resolve,reject)=>{
        mUser.findByPk(data.username)
            .then((user)=>{
                user.setRoles(data.roleId);
                resolve(user);
            }).catch(error=>{
            reject(error);
        })
    })
}
function addARole(data){
    return new Promise((resolve,reject)=>{
        mUser.findByPk(data.username)
            .then((user)=>{
                user.addRoles(data.roleId);
                resolve(user);
            }).catch(error=>{
            reject(error);
        })
    })
}
/*
//Many to Many Example
function getAUserRole(data){
    console.log(data);
    return new Promise((resolve, reject) => {
        mUser.findAll({
            where: {
                username: data.username
            },
            include: [
                {
                    model:mRole,
                    through: mUserRoles
                }
            ]
        }).then(myData=>{
            if (myData != null && myData != undefined){
                resolve(JSON.stringify(myData));
            }
            else
                reject("Cannot get the role Id!");
        }).catch(error => {
            reject(error);
        })
    })
}
*/
function getAUserRole(username){

    return new Promise((resolve, reject) => {
        mUserRoles.findAll({
            where: {
                userUsername: username
            }
        }).then(myData=>{
            if (myData != null && myData != undefined){
                resolve(JSON.stringify(myData));
            }
            else
                reject("Cannot get the role Id!");
        }).catch(error => {
            reject(error);
        })

    })
}

function checkValidationOfUser(username, password){
    return new Promise((resolve, reject) => {
        mUser.findOne({
            where:{
                username: username,
            }
        }).then(user=>{
            if (user == null || user ==undefined){
                reject("There is no user with this username " + username);
            }
            mUser.findOne({
                where:{
                    username: username,
                    password : password
                }
            }).then(user=>{
                if (user != null && user != undefined ){
                    user = JSON.stringify(user);
                    //console.log(user);
                    resolve(user);
                }else{
                    reject("Username or Password is wrong!");
                }
            }).catch(error => {
                reject(error);
            })
        }).catch(error=>{
            reject(error);
        })

    });
}


function getRoleWithId(id){
    return new Promise((resolve, reject) => {
        mUserRoles.findAll({
            where: {
                roleId: id,
            }
        })
            .then(result=>{
                if (result[0]!=null && result[0]!=undefined){
                    resolve(JSON.stringify(result));
                } else{
                    reject("Could not get the role with id:" +id);
                }
            }).catch(error => {
            reject("Cannot get all Users");
        })
    });
}

function getAllRoles(){
    return new Promise((resolve, reject) => {
        mUserRoles.findAll({

        })
            .then(result=>{
                if (result!=null && result!=undefined){
                    resolve(JSON.stringify(result));
                } else{
                    reject("Could not roles");
                }
            }).catch(error => {
            reject("Cannot get all Users");
        })
    });
}

function getRoleObject(){
    return new Promise((resolve, reject) => {
        mRole.findAll({

        })
            .then(result=>{
                if (result[0]!=null && result[0]!=undefined){
                    resolve(JSON.stringify(result));
                } else{
                    reject("Could not roles");
                }
            }).catch(error => {
            reject("Cannot get all Users");
        })
    });
}


function getAllUsers(){
    return new Promise((resolve, reject) => {

        mUser.findAll({
                //   attributes: ['foo', 'bar']
                attributes: {
                    exclude: ['password']
                },
            }
        ).then(user=>{
            resolve(JSON.stringify(user));
        }).catch(error => {
            reject("Cannot get all Users");
        })
    });
}

function deleteUser(userWhoMadeRequest,username){
    return new Promise((resolve,reject)=>{
        if (userWhoMadeRequest == username){
            reject("User cannot delete him/herself");
        }
        mUser.destroy({
            where: {
                'username': username
            }
        }).then(user=>{
            resolve('User is deleted');
        }).catch(error =>{
            reject(error + ' User cannot be deleted!');
        })
    })
}



/*
    mUser.findAll({
        association: [{
            model: 'tables',
            where: {
                username: username
            }
        }]
    }).then(data=>{
        console.log(data[0].get(0));
        resolve(data[0].get(0));
    }).catch(error => {
        reject(error + " Cannot get all Tables Related to this ");
    })
});
*/

/*
function getAllTables(){
    return new Promise((resolve, reject) => {
        mUser.findAll({
        }).then(data=>{
            console.log(data[0].get(0));
            resolve(data[0].get(0));
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}
/*
Model.findAll({
    attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
});
SELECT COUNT(hats) AS no_hats ...
*/
/*
function manyToMany() {
    Child.find({where: {Name: "Joe"}})
        .then(childInst => {
            return childInst.get();
        })
        .then(childData => {
            return Parent_Child.find({where: {Child_id: childData.id}})
        })
        .then(parentChildInst => {
            return parentChildInst.get();
        })
        .then(parentChildData => {
            return Parent.find({where: {id: parentChildData.Parent_id}})
        })
        .then(parentInst => {
            return parentInst.get();
        })
        .then(parentData => {
            return parentData;
            /*
              {
                {
                  id: 1,
                  name: "John",
                  type: "Father"
                }
              }
        })
}
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