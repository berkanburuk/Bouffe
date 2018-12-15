let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mBeverage = db.model(dbNames.beverage);
let mOrder = db.model(dbNames.order);
let mOrderBeverage = db.model(dbNames.orderBeverage);


let checkUsersRole = require('./RoleCheck');
let checkDataType = require('../Util/TypeCheck');


exports.getABeverage = function (id){
    console.log("getABeverage");
    return new Promise((resolve, reject) => {
        mBeverage.findOne({
            where:{
                id:id
            }
        })
            .then(dbData=>{
                console.log("Beverage Data " + dbData);
                if (dbData!= null && dbData != undefined){
                    resolve(dbData);
                }
                else{
                    reject("There is no beverage with this name: " + data.name);
                }
            }).catch(error => {
            reject(error);
        })
            .catch(error=>{
                reject(error);
            })

    })
}


function createBeverage(data){
    //var data = sampleUserData();
    return new Promise((resolve, reject) => {
        mBeverage.findOrCreate({
            where:
                {
                    id: data.id
                },
            defaults:
                {
                    name: data.name,
                    available: data.available,
                    price: data.lastName,
                }
        }).then((beverage)=>{
            console.log("Beverage" + user[1]);
            if (beverage[1] == false){
                reject('This beverage is already added!');
                return;
            }
            resolve("Beverage is added successfully.");
        })
        /*.spread((user, created)=> {
            console.log("CRRRR : " + created);
            console.log(user.get({plain: true}));

        })*/
            .catch(error =>{
                reject("Beverage cannot be created!\nFields are missing" + error);
            })

    })

}


function deleteBeverage(id){
    return new Promise((resolve,reject)=>{
        mBeverage.destroy({
            where: {
                id: data.id
            }
        }).then(beverage=>{
            if (beverage>0)
                resolve('Beverage is deleted');
            else
                reject("There is no beverage with name of : "+data.name);
        }).catch(error =>{
            reject(error);
        })
    })
}

function getAllBeverage (){
    return new Promise((resolve, reject) => {
        mBeverage.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(beverage=>{
            resolve(JSON.stringify(beverage));
        }).catch(error => {
            reject(error + "\nCannot get all Food");
        })
    });
}




module.exports = function(app){


    app.get('/beverage', function (request, response) {
        console.log('Food');
        if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId))) {
            response.sendFile(path.resolve('public/Pages/Beverage.html'));
        }else {
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }
    }),

        app.post('/api/beverage/addBeverage', function (request, response ) {
            console.log("Add Food");
            var data = request.body;

            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId))){



                createBeverage(data).then(beverage => {
                    response.statusCode = 200;
                    console.log(beverage);
                    response.write(JSON.stringify(beverage), () => {
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),

        app.get('/api/beverage/deleteBeverage/:id', function (request, response ) {
            console.log("Delete Beverage");
            console.log(request.body);
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId))){
                var id = parseInt(request.params.id);
                console.log(request.params.id);

                console.log(id);
                if(!checkDataType.isNumber(id)){
                    response.write(checkDataType.errorMesage(), () => {
                        response.statusCode = 400;
                        response.end();

                    })
                    return false;
                }

                deleteBeverage(id).then(beverage=> {
                    response.statusCode = 200;
                    console.log(beverage);
                    response.write(beverage.toString(), () => {
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }


        })

    app.post('/api/beverage/updateFood', function (request, response ) {
        console.log("Update Food");
        var data = request.body;
        if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId))){
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
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }


    }),


        app.get('/api/food/getAFood/:name', function (request, response ) {
            console.log("Get a Food");
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId)
                ||  checkUsersRole.isChef(request.session.roleId))){
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        })


    app.get('/api/beverage/getAllBeverage', function (request, response ) {
        console.log("Get all Food");

        if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId))){
            var data = request.params;
            console.log(data);

            getAllBeverage().then(beverage => {
                response.statusCode = 200;
                console.log(beverage);
                response.write(beverage.toString(), () => {
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
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }
    }),



}



