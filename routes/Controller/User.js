let path = require('path');

let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mUser = db.model(dbNames.user);


const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mUser.create(data).then(user=> {
            console.log(user.get())
            resolve(user);
        }).catch(error => {
            reject('Cannot create the user!');
        });
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
                username: username
            }
        }).then(user=>{
            resolve('User is deleted');
        }).catch(error =>{
            reject(error + ' User cannot be deleted!');
        })
    })
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

        app.post('/api/:addUser/', function (request, response, next) {
            var data = request.body;
            /*
            for (var key in data) {
                console.log(data[key]);
            }*/
            response.end('Successfully Added');
            next();
        })


    app.post('/api/:addUser2/', function (request, response, next) {
        var data = request.body;
        save(data).then()
        response.end('Successfully Added');
        next();
    })

    //checkUser
    app.get('/api/:getAllUsers', function (request, response, next) {

        getAllUsers().then(user => {
            console.log(user);
        }).catch(error => {
            console.log(error);
        })

        next();
    })

    //checkUser
    app.get('/api/:username/:password', function (request, response, next) {

        checkValidationOfUser('berkan', '1234').then(user => {
            response.statusCode = 200;
            console.log(user);
            response.end(user);
        }).catch(error => {
            response.statusCode = 404;
            console.log(error);
            response.end(error);
        })
        next();
    });

    app.get('/user/api/delete/:username', function (request, response, next) {
        console.log(request);
        console.log(request.username);
        deleteUser(null).then(user => {
            console.log(user);
        }).catch(error => {
            console.log(error);
        })
        next();

    });

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