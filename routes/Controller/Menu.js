let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mMenu = db.model(dbNames.menu);
let mFood = db.model(dbNames.food);
let mMenuFood = db.model(dbNames.menuFood);

let checkUsersRole = require('./RoleCheck');

function getMenu(data){
    /*
    data.name

     */
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

function menuType(type) {
    if (type == "appetizer")
        return type;
    else if (type == "mainCourse")
        return type;
    else if (type == "dessert")
        return type;
    else
        return false;
}


function createMenuAndAssignFood(data){
    /*
                        data.name,
                        data.cuisineRegion,
                        data.date,
                        data.setPrice,
                        data.foodName
     */
    return new Promise((resolve, reject) => {
        return mMenu.findOrCreate({
            where:
                {
                    name: data.name
                },
            defaults:
                {
                    name: data.name,
                    cuisineRegion: data.cuisineRegion,
                    date: data.date,
                    setPrice: data.setPrice
                }
        }).then((menu) => {
            console.log(menu[0]);
            /*
            menu[0].addFood(data.foodName).then(menu => {
                console.log(menu);
                if (menu != null || menu != undefined)
                    resolve("Food is added to Menu!");
                else
                */
                    resolve("Menu Created Successfully!");
            }).catch(error => {
                reject("Menu could not be created!" + error);
            })
        })
}



function assignFoodToMenu(data){
    /*
                        data.menuName,
                        data.cuisineRegion,
                        data.date,
                        data.setPrice,
                        data.foodName
     */
    return new Promise((resolve, reject) => {
        return mMenu.findOne({
            where:
                {
                    name: data.menuName
                }
        }).then((menu) => {
            console.log(data.foods)
            /*
              {
                foods:[
                          {},
                          {}
                      ]
              }
             */
            /*
            data = JSON.stringify(data);
            console.log(data);
                var parsedJSON = JSON.parse(data.foods);
                for (var i=0;i<parsedJSON.length;i++) {
                    alert(parsedJSON[i].foodName);
                }

*/

            var parsedJSON = JSON.parse(data);
            console.log(parsedJSON);
            for (var i=0;i<parsedJSON.length;i++) {
                menu.addFood(parsedJSON.foods[i].foodName).then(menu => {
                    console.log(menu);
                    if (menu != null || menu != undefined)
                        resolve("Food is added to Menu!");
                    else
                        reject("Food does not entered to assign to Menu!");
                })
            }
        }).catch(error => {
            reject(error);
        })
    })
}

function deleteMenu(data){
    /*
    data.name
     */
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
    /*

    */
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


exports.getMenusFood = function(menuName) {
    /*
    Get All Food names of Menu
     */
    return new Promise((resolve, reject) => {
        mMenuFood.findAll({
            where:{
                menuName:menuName
            }
        }).then(result=>{
            resolve(JSON.stringify(result[0]));
        }).catch(error=>{
            reject(JSON.stringify(error));
        })
    }).catch(error=>{
        reject(error);
    })
}

//Many to Many Example
function getFoodOfMenu(data){
    /*
    Get All Food Of Menu
     */
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

function getAllMenu(){
    return new Promise((resolve, reject) => {
        mMenu.findAll({

        }).then(data=>{
            if (data != null && data != undefined){
                resolve(JSON.stringify(data));
            }
            else
                reject("Cannot get the Menu!");
        }).catch(error => {
            reject(error);
        })

    })
}
module.exports = function (app) {

    app.get('/menu', function (request, response) {
        if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId)
            ||  checkUsersRole.isChef(request.session.roleId))) {
            console.log('Menu');
            response.sendFile(path.resolve('public/Pages/Menu.html'));
        }else {
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }

    }),

        app.post('/api/menu/addMenu', function (request, response) {
            var data = request.body;
            console.log(data);
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)||
                checkUsersRole.isChef(request.session.roleId) ||  checkUsersRole.isChef(request.session.roleId))) {
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),
        app.post('/api/menu/assignFoodToMenu', function (request, response) {
            var data = request.body;
            console.log("assignFoodToMenu" + data);

            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)||
                checkUsersRole.isChef(request.session.roleId) ||  checkUsersRole.isChef(request.session.roleId))) {
                assignFoodToMenu(data).then(menu => {
                    response.statusCode = 200;


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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        }),



        app.get('/api/menu/deleteMenu/:name', function (request, response) {
            console.log('Delete Menu');
            var data = request.params;
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)||
                checkUsersRole.isChef(request.session.roleId) ||  checkUsersRole.isChef(request.session.roleId))) {

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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),
        app.get('/api/menu/getMenu/:name', function (request, response ) {
            console.log("Get a Food");
            let data = request.params;
            console.log(data);
            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)||
                checkUsersRole.isChef(request.session.roleId) ||  checkUsersRole.isChef(request.session.roleId))) {
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
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }


        }),



        app.get('/api/menu/getFoodOfMenu/:menuName/:foodName', function (request, response ) {
            console.log("getFoodOfMenu");
            let data = request.params;
            console.log(data);

            if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)||
                checkUsersRole.isChef(request.session.roleId) ||  checkUsersRole.isChef(request.session.roleId))) {
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
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        })

    app.get('/api/menu/getAllMenu', function (request, response ) {


        if (request.session != undefined  && (checkUsersRole.isAdmin(request.session.roleId)||
            checkUsersRole.isChef(request.session.roleId) ||  checkUsersRole.isChef(request.session.roleId))) {
            getAllMenu().then(menu => {
                response.statusCode = 200;
                console.log(menu);
                response.write(menu, () => {
                    response.end();
                });
            }).catch(error => {
                response.statusCode = 404;
                console.log(error);
                response.write(error.toString(), () => {
                    response.end();
                });
            })
        }
        else {
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }

    })




}

