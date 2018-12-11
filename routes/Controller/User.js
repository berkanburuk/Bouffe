let path = require('path');

let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let mUserFunc = require('../Util/DatabaseConnection').getUserModel;

let isAdmin = require('./RoleCheck').isAdmin;
let isWaiter = require('./RoleCheck').isWaiter;
let isBartender = require('./RoleCheck').isBartender;
let isChef = require('./RoleCheck').isChef;
let isMatre = require('./RoleCheck').isMatre;
let errorMessage = require('./RoleCheck').errorMesage;


    let db = sequelize();
let dbNames = tableNames();
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);
let mTable = db.model(dbNames.table);
let mUserRoles = db.model(dbNames.userRoles);

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
    app.get('/user', function (request, response) {
        console.log('User Controller');
        response.sendFile(path.resolve('../../public/Pages/index.html'));
        //response.render(path.resolve('../../public/Pages/index.html'));
    }),
        app.get('/api/user/deleteUser/:username', function (request, response ) {

            console.log("Delete USER");

            if (session != undefined && isAdmin(session.roleId)) {

                    var username = request.params.username;

                    deleteUser(username).then(user => {
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
                } else {
                    response.write(errorMessage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }

        }),

        //checkUser
        app.post('/api/user/login', function (request, response) {
            /*
            var username = request.params.username;
            var password = request.params.password;
            */
            var data = request.body;
            console.log(request.body);

            checkValidationOfUser(data.username,data.password).then(user => {
                response.statusCode = 200;
                console.log(user);
                response.write("Successful",()=>{

                    session.username=data.username;
                    getAUserRole(data.username).then(role=>{
                        var myRole = JSON.parse(role);
                        console.log("myrole "+ myRole[0].roleId);
                        session.roleId = myRole[0].roleId;
                        console.log("Session: " + session.username + session.roleId);
                    }).catch(error=>{
                        console.log(error);
                    })
                    response.end();
                });
            }).catch(error => {
                response.statusCode = 404;
                console.log(error);
                response.write(error.toString(),()=>{
                    response.end();
                });
            })

        }),

        app.post('/api/user/addUser', function (request, response) {
            console.log("Create A User");
            var data = request.body;
            console.log(data);
                if (session != undefined && isAdmin(session.roleId)) {
                    data.roleId = parseInt(data.roleId, 10);
                    data.courseId = parseInt(data.courseId, 10);


                    console.log(data);
                    createAUser(data).then(user => {
                        response.statusCode = 200;
                        console.log(user);

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
                } else {
                    response.write(errorMessage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }

        }),
        app.post('/api/user/updateAUser', function (request, response) {
            console.log("Update A User");
                if (session != undefined && isAdmin(session.roleId)) {
                    var data = request.body;
                    updateAUser(data).then(user => {
                        response.statusCode = 200;
                        console.log(user);
                        response.send(user.toString());
                    }).catch(error => {
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

        }),



        app.get('/api/user/getAllUsers/:username', function (request, response) {

            console.log("Get all Users");
                if (session != undefined && isAdmin(session.roleId)) {
                    getAllUsers().then(user => {
                        response.statusCode = 200;
                        console.log(user[0].get(0));
                        response.write(user[0].get(0).toString(), () => {
                            response.end();
                        })
                    }).catch(error => {
                        response.statusCode = 404;
                        console.log(error);

                        response.write(error, () => {
                            response.end();
                        });
                    })
                }else {
                    response.write(errorMessage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }

        }),

        app.get('/api/getATableBelongToAUser/:username', function (request, response) {
            console.log("getATableBelongToAUser");
            if (session != undefined &&
                (isAdmin(session.roleId) || isWaiter(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId))
            {
                var username = request.params;
                console.log(username);
                getATableBelongToAUser(username).then(data => {
                    response.statusCode = 200;
                    console.log(data);
                    response.write(data.toString(), () => {
                        response.end();
                    })
                })
                    .catch(error => {
                        response.statusCode = 404;
                        console.log(error);
                        response.write(error, () => {
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








function save(data){
    return new Promise((resolve,reject)=>{
        mUser.create(data).then(user=> {
            console.log(user.get(0))
            resolve(user.get(0));
        }).catch(error => {
            reject('Cannot create the user!');
        });
    })
}

function createAUser(data){
    //var data = sampleUserData();
    return new Promise((resolve, reject) => {
        mUser.findOrCreate({
            where:
                {
                    username: data.username
                },
            defaults:
                {
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    bilkentId: data.bilkentId
                }
        }).then((user)=>{
            console.log(user[0].get(0));
            user[0].addRoles(data.roleId).then(()=>{
                console.log("Role is added!");
            }).catch(error=>{
                reject("Course could not be created!");
            })
            user[0].addCourses(data.courseId).then(()=>{
                console.log("Course is added!");
            }).catch(error=>{
                reject("Course could not be created!");
            })

            resolve("User is created successfully.");
        })
        /*.spread((user, created)=> {
            console.log("CRRRR : " + created);
            console.log(user.get({plain: true}));

        })*/
            .catch(error =>{
                reject("User cannot be created!" + error);
            })

    })

}



function updateAUser(data){
    var data = sampleUserData();
    return new Promise((resolve, reject) => {
        mUser.findOne({
            where:
                {
                    username: data.username
                }
        }).then((user)=>{
            console.log(user[0].get(0));
            user[0].setRoles(data.roleId);
            user[0].setCourses(data.courseId);
            resolve("User is updated successfully.");
        })
        /*.spread((user, created)=> {
            console.log("CRRRR : " + created);
            console.log(user.get({plain: true}));

        })*/
            .catch(error =>{
                reject("User Cannot Be Updated!" + error);
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
                username: data
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
function getAUserRole(data){
    console.log(data);
    return new Promise((resolve, reject) => {
        mUserRoles.findAll({
            where: {
                userUsername: data
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
    });
}



function getAllUsers(){
    return new Promise((resolve, reject) => {

        mUser.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(user=>{
            resolve(user);
        }).catch(error => {
            reject("Cannot get all Users");
        })
    });
}

function deleteUser(username){
    return new Promise((resolve,reject)=>{
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

function getATableBelongToAUser(data){
    return new Promise((resolve, reject) => {
        mTable.findAll({
            where: { userUsername: data.username },
            include: [{
                model: mUser,
            }]
        }).then(data=>{
            if (data[0]!= null && data[0] != undefined){
                resolve(data[0].get(0));
            }
            else
                reject("User does not have any table assigned!");
        }).catch(error => {
            reject(error + " Cannot get all Tables Related to this ");
        })
    });
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
}
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

*/
function sampleUserData(){
    var data = {
        username:'happy',
        password: '4123',
        firstName: 'ali',
        lastName: 'veli',
        bilkentId: 1234,
        roleId:1,
        courseId:246
    }
    return data;

}