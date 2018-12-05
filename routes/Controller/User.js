let path = require('path');

let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let mUserFunc = require('../Util/DatabaseConnection').getUserModel;

let db = sequelize();
let dbNames = tableNames();
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);


module.exports = function(app) {

    app.get('/user', function (request, response,next) {
        console.log('User Controller');
        response.sendFile(path.resolve('../../public/Pages/index.html'));
        //response.render(path.resolve('../../public/Pages/index.html'));
        next();
    }),
        app.get('/api/:deleteuser', function (request, response,next ) {
            console.log("Delete USER");
            deleteUser('berkan').then(user => {
                console.log("Delete User: " + user);
                response.end('Deleted');
            }).catch(error => {
                console.log("Delete User: " + error);
                response.end(error);
            })
            next();
        }),

        //checkUser
            app.get('/api/:user/:username/:password', function (request, response,next) {
                    var username = request.params.username;
                    var password = request.params.password;
                    console.log(username,password);
        checkValidationOfUser(username,password).then(user => {
            response.statusCode = 200;
            console.log("user "+user);
            response.end(user);
        }).catch(error => {
            response.statusCode = 404;
            console.log(error);
            response.end(error);
        })
                next();
    })

        app.post('/api/:user/:createAUser', function (request, response,next) {
        console.log("Create A User");
        var data = request.body;
        createAUser(data).then(user => {
            console.log(user);
            response.end(user);
        }).catch(error => {
            console.log(error);
            response.end(error);
        })
            next();
    }),
        app.post('/api/:user/:updateAUser', function (request, response,next) {
            console.log("Update A User");
            var data = request.body;
            updateAUser(data).then(user => {
                console.log(user);
                response.end(user);
            }).catch(error => {
                console.log(error);
                response.end(error);
            })
            next();

        }),

        app.get('/api/:user/:getAllUsers', function (request, response,next) {
            console.log("Get all Users");

            getAllUsers().then(user => {
                console.log(user[0].get(0));
                response.end(user[0].get(0));
            }).catch(error => {
                console.log(error);
                response.end(error);
            });
            next();

        }),

        app.get('/api/:user/:getTables', function (request, response,next) {
        getAllTables('a').then(data => {
            console.log(data);
        }).catch(error=>{
            console.log(error);
        })
            next();
    })
      /*
        app.get('/api/:user/:addARole', function (request, response,next) {
        addARole('a').then(data => {
            console.log(data);
        }).catch(error=>{
            console.log(error);
        })
            next();
    })


        app.get('/api/:user/:getAUserRole', function (request, response) {
            console.log('getAUserRole');
            getAUserRole('berkan').then(data => {
                console.log(data);
                response.write('2');
            }).catch(error => {
                console.log(error);
                response.write('2');
            })

        })


*/


}





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
            user[0].addRoles(data.roleId);
            user[0].addCourses(data.courseId);

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
const getAUserRole = (username)=>{
    return new Promise((resolve,reject)=>{
        mUser.findByPk('username')
            .then((user)=>{
                resolve(user.getRoles())
            }).catch(error=>{
            reject(error);
        })
    })
}
*/

function checkValidationOfUser(username, password){
    return new Promise((resolve, reject) => {
        mUser.findOne({
            where:{
                username: username,
                password : password
            }
        }).then(user=>{
            if (user != null && user != undefined ){
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

function getAllTables(data){
    return new Promise((resolve, reject) => {
        mUser.findAll({
            include: [{
                model: 'table',
                /*
                where: {
                    'username': 'berkan'
                }
                */
            }]
        }).then(data=>{
            console.log(data.get());
            resolve(data.get());
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