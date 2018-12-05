let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mFood = db.model(dbNames.food);

const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mFood.create(data).then(food=> {
            console.log(food.get())
            resolve(food);
        }).catch(error => {
            reject(error + 'Cannot create the Food!');
        });
    })
}

const GetAFood = (name) => {
    return new Promise((resolve, reject) => {
        mFood.findOne({
            where:{
                'name':name
            }
        }).then(food=>{
            resolve(food.get());
        }).catch(error => {
            reject(error + "\nCannot get the Food!");
        })
    });
}



const getAllFood = () => {
    return new Promise((resolve, reject) => {
        mFood.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(food=>{
            resolve(food.get());
        }).catch(error => {
            reject(error + "\nCannot get all Food");
        })
    });
    /*
    foodsController.findAll({ raw: true }).then(result =>{
        console.log(result);
        //res.status(200).send({ data: result });
        res.end(result)
    });
    */
}
//primaryKey  = name olmalı
const deleteFood = (name) =>{
    return new Promise((resolve,reject)=>{
        mFood.destroy({
            where: {
                'name': name
            }
        }).then(food=>{
            resolve(food + 'Food is deleted');
        }).catch(error =>{
            reject(error + ' Food could not be deleted!');
        })
    })
}






module.exports = function(app){


        app.get('/food', function (request, response) {
            console.log('Instructor');
            response.sendFile(path.resolve('../../public/Pages/Food.html'));
            //res.end();
        }),


            app.post('/api/:food/:addFood', function(request,response,next){
            var data = request.body;
            Food.save(data);
            response.end('Food Successfully Added!');
            next();

        }),

        app.get('/api/:food/:getAllFoods', function (req, res, next) {


            next();
        })


    }



