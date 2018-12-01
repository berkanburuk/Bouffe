let path = require('path');

let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;
let mUserFunc = require('../Util/DatabaseConnection').getUserModel;

let db = sequelize();
let dbNames = tableNames();
let mUser = db.model(dbNames.user);
let mRole = db.model(dbNames.role);

const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mUser.create(data).then(user=> {
            console.log(user.get(0))
            resolve(user.get(0));
        }).catch(error => {
            reject('Cannot create the user!');
        });
    })
}



const createDefaultUser = (data,roleId)=> {
    return new Promise((resolve, reject) => {
        mUser.findOrCreate({
            where:{
                username:data.username
            }
        })
            .then((user) => {
                console.log(user[0].get(0));
                user[0].setRoles(roleId);
            })
            .catch(error=>{
                reject(error);
            })
    })
}
const setARole = (data,roleId) =>{
    return new Promise((resolve,reject)=>{
        mUser.findByPk(data.username)
            .then((user)=>{
                user.setRoles(roleId);
                resolve(user);
            }).catch(error=>{
            reject(error);
        })
    })
}

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


const checkValidationOfUser = (username, password) => {
    return new Promise((resolve, reject) => {
        mUser.findOne({
            where:{'username': username,
                'password' : password
            }
        }).then(user=>{
            resolve(user.get());
        }).catch(error => {
            reject("Username or Password is wrong!");
        })
    });
}

const getAllUsersDeneme = () => {
    return new Promise((resolve, reject) => {
        mUser.findAll({})
            .then(user=>{
                console.log(user);
            resolve(user);
        }).catch(error => {
            reject(error);
        })
    });
}


const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        mUser.findAll({
             //   attributes: ['foo', 'bar']
            }
        ).then(user=>{
            resolve(user.get());
        }).catch(error => {
            reject("Cannot get all Users");
        })
    });
}

const deleteUser = (username) =>{
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


const getAllTables = (data) => {
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
module.exports = function(app) {

    app.get('/user', function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/index.html'));
        //res.end();
    }),

        app.get('/api/:user/:addRoleToUser'), function (request, response) {

            console.log('addRoleToUser');
            addRoleToUser(data).then(user => {
                console.log(user);
                response.write('2');
            }).catch(error => {
                console.log(error);
                response.write('2');
            })

        },
        app.get('/api/:user/:getAUserRole'), function (request, response) {
            console.log('getAUserRole');
            getAUserRole('berkan').then(data => {
                console.log(data);
                response.write('2');
            }).catch(error => {
                console.log(error);
                response.write('2');
            })

        },

    app.post('/api/:user/:addUser2'), function (request, response) {
        var data = request.body;
        save(data).then(user => {
            console.log(user);
        }).catch(error => {
            console.log(error);
        })
    },

    //checkUser
    app.get('/api/:user/:getAllUsers', function (request, response) {
    /*
        getAllUsers().then(user => {
            console.log(user);
        }).catch(error => {
            console.log(error);
        });
*/
        getAllUsersDeneme().then(user => {
            console.log(user);
            response.send(user);
            //response.end();
        }).catch(error => {
            console.log(error);
        });

    }),

    //checkUser
    app.get('/api/:user/:username/:password'), function (request, response) {

        checkValidationOfUser('berkan', '1234').then(user => {
            response.statusCode = 200;
            console.log(user);
            response.send(user);
        }).catch(error => {
            response.statusCode = 404;
            console.log(error);
            response.end(error);
        })

    },


    app.get('/api/:user/:deleteUser'), function (request, response) {
        console.log(request);
        console.log(request.username);
        deleteUser(null).then(user => {
            console.log(user);
        }).catch(error => {
            console.log(error);
        })


    },
        app.get('/api/:user/:getTables'), function (request, response) {
            getAllTables('a').then(data => {
                console.log(data);
            }).catch(error=>{
                console.log(error);
            })



        }




}



/*
// register a route and add all methods
router.route('/user/:id')
    .get(function (req, res) {
        // this is GET /pet/:id
        res.setHeader('Content-Type', 'application/json')
        //res._write('hel');
        res.end(JSON.stringify({ name: 'hello' }))

    })
    .delete(function (req, res) {
        // this is DELETE /pet/:id
        res.end()
    })
    .all(function (req, res) {
        // this is called for all other methods not
        // defined above for /pet/:id
        res.statusCode = 405
        res.end()
    })



module.exports = router;

*/