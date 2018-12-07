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
                name:name
            }
        }).then(food=>{
            resolve(food.get(0));
        }).catch(error => {
            reject(error + "\nCannot get the Food!");
        })
    });
}

function createAFood(data){
    return new Promise((resolve, reject) => {
        mFood.findOrCreate({
            where:
                {
                    name: data.name
                },
            defaults:
                {
                    type: data.type,
                    description: data.description,
                    available: data.available,
                    price: data.price
                }
        }).then((food)=>{
            resolve("Food is created successfully.");
        })
            .catch(error =>{
                reject("Food cannot be created!" + error);
            })

    })

}


function deleteFood(name){
    return new Promise((resolve,reject)=>{
        mFood.destroy({
            where: {
                name: name
            }
        }).then(food=>{
            resolve('Food is deleted');
        }).catch(error =>{
            reject("Food could not be deleted!");
        })
    })
}


function updateFood(data){
    return new Promise((resolve, reject) => {
        mFood.update(data, {
            where:
                {
                    name: data.name
                },
        }).then((food)=>{
            console.log(food);
            if(food[0]>0){
                resolve("Food is updated successfully.");
            }else {
                reject("Food could not updated!");
            }

        }).catch(error =>{
            reject(error);
        })

    })

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








module.exports = function(app){


        app.get('/food', function (request, response) {
            console.log('Food');
            response.sendFile(path.resolve('../../public/Pages/Food.html'));
            //res.end();
        }),

            app.post('/api/food/addFood', function (request, response ) {
                console.log("Add Food");
                var data = request.body;

                createAFood(data).then(food => {
                    response.statusCode = 200;
                    console.log(food);
                    response.write(food,()=>{
                        response.end();
                    })

                }).catch(error => {
                    console.log(error);
                    response.statusCode = 404;
                    response.write(error,()=>{
                        response.end();
                    })
                })

            }),

            app.post('/api/food/deleteFood', function (request, response ) {
                console.log("Delete Reservation");

                var data = request.body;
                deleteFood(data.name).then(food=> {
                    response.statusCode = 200;
                    console.log(food);
                    response.write(food,()=>{
                        response.end();
                    })

                }).catch(error => {
                    console.log(error);
                    response.statusCode = 404;
                    response.write(error,()=>{
                        response.end();
                    })
                })


            })

    app.post('/api/food/updateFood', function (request, response ) {
        console.log("Update Food");

        var data = request.body;
        console.log("Will be Updated : " +  data["name"]);

        updateFood(data).then(food=> {
            response.statusCode = 200;
            console.log(food);
            response.write(food,()=>{
                response.end();
            })

        }).catch(error => {
            response.statusCode = 404;
            console.log(error);
            response.write(error,()=>{
                response.end();
            })
        })


    }),


        app.get('/api/food/getAFood/:foodName', function (request, response ) {
            console.log("Get a Food");
            var name = request.params.foodName;
            console.log(request);
            console.log(name);

            GetAFood(name).then(food=> {
                response.statusCode = 200;
                console.log(food);
                response.write(food.toString(),()=>{
                    response.end();
                });
            }).catch(error => {
                response.statusCode = 404;
                console.log(error);
                response.write(error.toString(),()=>{
                    response.end();
                });
            })

        })



}



