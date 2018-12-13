let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mFood = db.model(dbNames.food);
let mMenuFood = db.model(dbNames.menuFood);

let isAdmin = require('./RoleCheck').isAdmin;
let isWaiter = require('./RoleCheck').isWaiter;
let isBartender = require('./RoleCheck').isBartender;
let isChef = require('./RoleCheck').isChef;
let isMatre = require('./RoleCheck').isMatre;
let errorMessage = require('./RoleCheck').errorMesage;

//Örnek
function getFood(data){
    return new Promise((resolve, reject) => {
        mFood.findOne({
            where:{
                name:data.name
            }
        })
            .then(dbData=>{
            if (dbData!= null && dbData != undefined){
                resolve(JSON.stringify(dbData));
            }
            else{
                reject("There is no food with this name: " + data.name);
            }
        })
            .catch(error => {
            reject(error);
        })
            .catch(error=>{
                reject(error);
            })
    })
}

exports.getAllFeaturesOfFood = function(foodName) {
    return new Promise((resolve, reject) => {
        mMenuFood.findOne({
            where:{
                name:foodName
            }
        }).then(result=>{
            resolve(result[0]);
        }).catch(error=>{
            reject(error);
        })
    }).catch(error=>{
        reject(error);
    })
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


function deleteFood(data){
    return new Promise((resolve,reject)=>{
        mFood.destroy({
            where: {
                name: data.name
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


function getAllFood (){
    return new Promise((resolve, reject) => {
        mFood.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(food=>{
            resolve(JSON.stringify(food));
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








module.exports = function(app,session){


        app.get('/food', function (request, response) {
            console.log('Food');
            response.sendFile(path.resolve('../../public/Pages/Food.html'));
            //res.end();
        }),

            app.post('/api/food/addFood', function (request, response ) {
                console.log("Add Food");
                var data = request.body;

                    if (session != undefined &&
                        (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                        createAFood(data).then(food => {
                            response.statusCode = 200;
                            console.log(food);
                            response.write(food, () => {
                                response.end();
                            })

                        }).catch(error => {
                            console.log(error);
                            response.statusCode = 404;
                            response.write(error, () => {
                                response.end();
                            })
                        })
                    }else {
                        response.write(errorMessage().toString(), () => {
                            response.statusCode = 404;
                            response.end();
                        })
                    }

            }),

            app.post('/api/food/deleteFood', function (request, response ) {
                console.log("Delete Reservation");
                if (session != undefined &&
                    (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                    var data = request.body;
                    deleteFood(data.name).then(food => {
                        response.statusCode = 200;
                        console.log(food);
                        response.write(food.toString(), () => {
                            response.end();
                        })

                    }).catch(error => {
                        console.log(error);
                        response.statusCode = 404;
                        response.write(error.toString(), () => {
                            response.end();
                        })
                    })
                }else {
                    response.write(errorMessage().toString(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }


            })

    app.post('/api/food/updateFood', function (request, response ) {
        console.log("Update Food");
        var data = request.body;
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                console.log(request);
                console.log("Will be Updated : " + data);

                updateFood(data).then(food => {
                    response.statusCode = 200;
                    console.log(food);
                    response.write(food.toString(), () => {
                        response.end();
                    })
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);
                    response.write(error.toString(), () => {
                        response.end();
                    })
                })
            }else {
                response.write(errorMessage().toString(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }


    }),


        app.get('/api/food/getAFood/:name', function (request, response ) {
            console.log("Get a Food");
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                var data = request.params;
                console.log(data);
                console.log(data.name);
                getFood(data).then(food => {
                    response.statusCode = 200;
                    console.log(food);
                    response.write(food.toString(), () => {
                        response.end();
                    });
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);
                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }else {
                response.write(errorMessage().toString(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        })


    app.get('/api/food/getAllFood', function (request, response ) {
        console.log("Get all Food");
        if (session != undefined &&
            (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
            var data = request.params;
            console.log(data);

            getAllFood().then(food => {
                response.statusCode = 200;
                console.log(food);
                response.write(food.toString(), () => {
                    response.end();
                });
            }).catch(error => {
                response.statusCode = 404;
                console.log(error);
                response.write(error.toString(), () => {
                    response.end();
                });
            })
        }else {
            response.write(errorMessage().toString(), () => {
                response.statusCode = 404;
                response.end();
            })
        }
    })




}



