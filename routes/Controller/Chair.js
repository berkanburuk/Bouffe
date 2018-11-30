let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mChair = db.model(dbNames.chair);


const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mChair.create(data).then(data=> {
            console.log(data.get())
            resolve(data);
        }).catch(error => {
            reject(error + 'Cannot create the Chair!');
        });
    })
}

const GetAChair = (name) => {
    return new Promise((resolve, reject) => {
        mChair.findOne({
            where: {
                'name': name
                }
            }).then(data=>{
            resolve(data.get());
        }).catch(error => {
            reject(error + "\nCannot get the Chair!");
        })
    });
}


const getAllChairs = () => {
    return new Promise((resolve, reject) => {
        mChair.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(data=>{
            resolve(data.get());
        }).catch(error => {
            reject(error + "\nCannot get all Chairs");
        })
    });
}
//primaryKey  = name olmalı
const deleteChair = (id) =>{
    return new Promise((resolve,reject)=>{
        mChair.destroy({
            where: {
                'id': id
            }
        }).then(data=>{
            resolve(data + ' Chair is deleted');
        }).catch(error =>{
            reject(error + ' Chair could not be deleted!');
        })
    })
}


module.exports = function(app){
    app.get('/chair', function (request, response) {
        console.log('Chair');
        response.sendFile(path.resolve('../../public/Pages/Chair.html'));
        //res.end();
    }),
    app.post('/api/:chair/:addChair', function(request,response,next){
        save(request.body);
        /*
        for (var key in data) {
            console.log(data[key]);
        }
        */
        next();
    })
}



