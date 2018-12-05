let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mTable = db.model(dbNames.table);
let mUser = db.model(dbNames.user);


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

function createAndAssignTableToUser(data){
    return new Promise((resolve, reject) => {
        mTable.findOrCreate({
            where:
                {
                    username: data.username
                }
        }).then((table)=>{
            console.log(table[0]);
            table.
            resolve("Table is created successfully.");
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
const GetATableWithChairs = (username) => {
    return new Promise((resolve, reject) => {
        mTable.findOne({
            where: {
                'id': id
            }
        }).then(data=>{
            resolve(data.get());
        }).catch(error => {
            reject(error + "\nCannot get the Table!");
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
const getAUserTables = (username) => {
    return new Promise((resolve, reject) => {
        mTable.findAll({
            where:{
                username:'berkan'
            },
            include: [{
                model: 'user',
                /*
                where: {
                    'username': 'berkan'
                }
                */
            }]
        }).then(data=>{
            console.log(data[0].get(0));
            resolve(data[0].get(0));
        }).catch(error => {
            reject(error + "\nCannot get all Tables Related to this ");
        })
    });
}
//primaryKey  = name olmalı
const deleteTable = (username) =>{
    return new Promise((resolve,reject)=>{
        mTable.destroy({
            where: {
                'username': username
            }
        }).then(data=>{
            resolve(data + ' Table is deleted');
        }).catch(error =>{
            reject(error + ' Table could not be deleted!');
        })
    })
}


module.exports = function(app){
    app.get('/table', function (request, response) {
        console.log('Instructor');
        //response.sendFile(path.resolve('../../public/Pages/Waiter.html'));
        //res.end();
    }),

        app.post('/api/:table/:addTable', function(request,response,next){
        save(request.body);
        response.end('Table Successfully Added!');
        next();
    }),
        app.get('/api/:table/:getTables', function(request,response,next){
            var username = request.params.username;
            /*
            getAUserTables(username).then(table=>{
                response.end(table);
            }).catch(error=>{
                response.end(error)
            })
*/
            next();
        }),
    app.get('/api/:table/:getTables', function (request, response) {

        //res.end();

    })
}



