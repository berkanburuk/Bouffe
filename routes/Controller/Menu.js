let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mMenu = db.model(dbNames.menu);
let mFood = db.model(dbNames.food);
let mMenuFood = db.model(dbNames.menuFood);

let isAdmin = require('./RoleCheck').isAdmin;
let isWaiter = require('./RoleCheck').isWaiter;
let isBartender = require('./RoleCheck').isBartender;
let isChef = require('./RoleCheck').isChef;
let isMatre = require('./RoleCheck').isMatre;
let errorMessage = require('./RoleCheck').errorMesage;


function getMenu(data){
    return new Promise((resolve, reject) => {
        mMenu.findOne({
            where:{
                name:data.name
            }
        })
            .then(dbData=>{
                if (dbData!= null && dbData != undefined){
                    resolve(JSON.stringify(dbData));
                }
                else{
                    reject("There is no menu with this name: " + data.name);
                }
            }).catch(error => {
                reject(error);
            })
            .catch(error=>{
                reject(error);
        })

    })
}
exports.getMenusFood = function(menuName) {
    return new Promise((resolve, reject) => {
        mMenuFood.findAll({
            where:{
                menuName:menuName
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


function createMenuAndAssignFood(data){

    return new Promise((resolve, reject) => {
           return mMenu.findOrCreate({
                where:
                    {
                        name: data.name
                    },
                defaults:
                    {
                        name: data.name,
                        cousinRegion: data.cousinRegion,
                        date: data.date,
                        setPrice: data.setPrice
                    }
            }).then((menu) => {
                console.log(menu[0]);
                menu[0].addFood(data.foodName).then(menu => {
                    console.log(menu);
                    if (menu != null || menu != undefined)
                        resolve("Food is added to Menu!");
                    else
                        reject("Food could not be added to Menu!");
                }).catch(error => {
                    reject(error);
                })
            }).catch(error => {
               reject("Menu could not be created!" + error);
           })
        })


}


function deleteMenu(data){
    return new Promise((resolve,reject)=>{
        mMenu.destroy({
            where: {
                name: data.name
            }
        }).then(menu=>{
            if (menu>0)
            resolve('Menu is deleted');
            else
                reject("There is no food with name of : "+data.name);
        }).catch(error =>{
            reject(error);
        })
    })
}


function addFoodToMenu(data){
    return new Promise((resolve, reject) => {

        var c = mMenu.getFoods().then(c=>{
            console.log(c);
        }).catch(error=>{
            console.log(error);
        })

        /*
        mTable.findAll({
            where: {
                foodName: data.foodName,
                menuName: data.menuName
            },
            include: [{
                model: mUser,
            }]
        }).then(data=>{
            if (data[0]!= null && data[0] != undefined){
                resolve(data[0].get(0));
            }
            else
                reject("User does not have any table assigned!");
        }).catch(error => {
            reject(error + " Cannot get all Tables Related to this ");
        })
        */
    })
}

//Many to Many Example
function getFoodOfMenu(data){
    console.log(data);
        return new Promise((resolve, reject) => {
            mMenu.findAll({
                where: {
                    name: data.menuName
                },
                include: [
                    {
                        model:mFood,
                        through: mMenuFood
                    }
                ]
            }).then(data=>{
                if (data != null && data != undefined){
                    resolve(JSON.stringify(data));
                }
                else
                    reject("Cannot get the Menu's Food!");
            }).catch(error => {
                reject(error);
            })

        })
}

module.exports = function (app,session) {

    app.get('/menu', function (request, response) {
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                console.log('Menu');
                response.sendFile(path.resolve('../../public/Pages/Menu.html'));
            }else {
                response.write(errorMessage().toString(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
    }),

        app.post('/api/menu/addMenu', function (request, response) {
            var data = request.body;
            console.log(data);
                if (session != undefined &&
                    (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                    createMenuAndAssignFood(data).then(menu => {
                        response.statusCode = 200;
                        console.log(menu);
                        response.write(menu.toString(), () => {
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
        }),
                app.get('/api/menu/deleteMenu/:name', function (request, response) {
                    console.log('Delete Menu');
                    var data = request.params;
                        if (session != undefined &&
                            (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                            deleteMenu(data).then(menu => {
                                response.statusCode = 200;
                                console.log(menu);
                                response.write(menu.toString(), () => {
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

                }),
        app.get('/api/menu/getMenu/:name', function (request, response ) {
            console.log("Get a Food");
            let data = request.params;
            console.log(data);
                if (session != undefined &&
                    (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                    getMenu(data).then(menu => {
                        response.statusCode = 200;
                        console.log(menu);
                        response.write(menu.toString(), () => {
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

        }),

        app.get('/api/menu/getFoodOfMenu/:menuName/:foodName', function (request, response ) {
            console.log("getFoodOfMenu");
            let data = request.params;
            console.log(data);
            if (session != undefined &&
                (isAdmin(session.roleId) || isChef(session.roleId)) ||isMatre(session.roleId)) {
                getFoodOfMenu(data).then(menu => {
                    response.statusCode = 200;
                    console.log(menu);
                    response.write(menu.toString(), () => {
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

