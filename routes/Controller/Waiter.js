let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mWaiter = db.model(dbNames.waiter);


const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mWaiter.create(data).then(data=> {
            console.log(data.get())
            resolve(data);
        }).catch(error => {
            reject(error + 'Cannot create the Waiter!');
        });
    })
}

const GetAWaiter = (username) => {
    return new Promise((resolve, reject) => {
        mWaiter.findOne({
            where: {
                'username': username
            }
        }).then(data=>{
            resolve(data.get());
        }).catch(error => {
            reject(error + "\nCannot get the Waiter!");
        })
    });
}


const getAllWaiters = () => {
    return new Promise((resolve, reject) => {
        mWaiter.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(data=>{
            resolve(data.get());
        }).catch(error => {
            reject(error + "\nCannot get all Waiters");
        })
    });
}
//primaryKey  = name olmalı
const deleteWaiter = (username) =>{
    return new Promise((resolve,reject)=>{
        mWaiter.destroy({
            where: {
                'username': username
            }
        }).then(data=>{
            resolve(data + ' Waiter is deleted');
        }).catch(error =>{
            reject(error + ' Waiter could not be deleted!');
        })
    })
}


module.exports = function(app){
    app.get('/waiter', function (request, response) {
        console.log('Instructor');
        response.sendFile(path.resolve('../../public/Pages/Waiter.html'));
        //res.end();
    }),

        app.post('/api/:waiter/:addWaiter'), function(request,response,next){
        save(request.body);
        response.end('Waiter Successfully Added!');
        next();
    }

}



