let path = require('path');

let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let mUserFunc = require('../Util/DatabaseConnection').getUserModel;

let checkUsersRole = require('./RoleCheck');





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
        response.sendFile(path.resolve('public/Pages/Login.html'));
        //response.render(path.resolve('../../public/Pages/index.html'));
    }),
        app.get('/uploadSRSFile', function (request, response) {
            console.log('UploadSRSFile');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
                response.sendFile(path.resolve('public/Pages/uploadSRSFile.html'));
            }else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        }),
        app.get('/signup', function (request, response) {
            console.log('Signup Controller');
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                    ||  checkUsersRole.isAdmin(request.session.roleId))) {
                    response.sendFile(path.resolve('public/Pages/AddUserManually.html'));
                }else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

            //response.render(path.resolve('../../public/Pages/index.html'));
        }),
        app.get('/navigation', function (request, response) {
            console.log('Navigation');
                if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                    ||  checkUsersRole.isAdmin(request.session.roleId) || checkUsersRole.isCashier(request.session.roleId))) {
                    response.sendFile(path.resolve('public/Pages/Navigation.html'));
                }else {
                    response.write(checkUsersRole.errorMesage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }
        }),
        app.get('/api/user/deleteUser/:username', function (request, response ) {

            console.log("Delete USER");
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){

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
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }


        }),

        //checkUser
        app.get('/api/user/login/:username/:password', function (request, response) {

                    var data = {
                        username: '',
                        password: ''
                    }
                    console.log(request.params);
                    data.username = request.params.username;
                    data.password = request.params.password;

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

                            //response.render(path.join('/public/Pages/Navigation.html'));

                            response.write("Successful", () => {
                                console.log("successsss");
                                response.end();
                            });

                            //response.sendFile(path.resolve('public/Pages/Navigation.html'));
                            //return response.redirect('/navigation');
                            //response.render('Navigation.html');
                            /*
                            response.writeHead(302,
                                {
                                    loc:'/navigation'
                                })
                                */

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
            var data = request.body;
            console.log(data);
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),
        app.post('/api/user/updateAUser', function (request, response) {
            console.log("Update A User");
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
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

                    response.write(error, () => {
                        response.end();
                    });
                })
            }		else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        })

    app.get('/api/user/getRole', function (request, response) {
        var a = request.session;
        console.log("getRole "+JSON.stringify(a));
        if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
            ||  checkUsersRole.isAdmin(request.session.roleId))){
            response.statusCode = 200;
            var data = JSON.stringify(request.session.roleId);
            response.write(data, () => {
                response.end();
            })
        }else {
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }
    }),

        app.get('/api/user/logout', function (request, response) {
            console.log("logout");
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isAdmin(request.session.roleId))){
                request.session.destroy();
                response.statusCode = 200;
                //redirect
                response.write("true",() => {
                    response.end();
                })
            }else {
                response.write(checkUsersRole.errorMesage(), () => {
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
            console.log("User" + user[1]);
            if (user[1] == false){
                reject('This user is already added!');
                return;
            }

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