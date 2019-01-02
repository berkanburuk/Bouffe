let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mMenu = db.model(dbNames.menu);
let mFood = db.model(dbNames.food);
let mMenuFood = db.model(dbNames.menuFood);

let foodController = require('./Food');

let checkUsersRole = require('./RoleCheck');
let checkDataType = require('../Util/TypeCheck');


function getMenu(data) {
    /*
    data.name

     */
    return new Promise((resolve, reject) => {
        mMenu.findOne({
            where: {
                name: data.name
            }
        })
            .then(dbData => {
                if (dbData != null && dbData != undefined) {
                    resolve(JSON.stringify(dbData));
                }
                else {
                    reject("There is no menu with this name: " + data.name);
                }
            }).catch(error => {
            reject(error);
        })
            .catch(error => {
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


function createMenuAndAssignFood(data) {
    /*
                        data.name,
                        data.cuisineRegion,
                        data.date,
                        data.setPrice,
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
                    isActive: false,
                    setPrice: data.setPrice
                }
        }).then((menu) => {
            resolve("Menu Created Successfully!");
        }).catch(error => {
            reject("Menu could not be created!" + error);
        })
    })
}

function updateAMenu(data) {
    return new Promise((resolve, reject) => {
        console.log(data.isActive)
        if (data.isActive == 'true') {
            mMenu.update({
                isActive: false
            },
                {
                    where:{
                        isActive:true
                    }
                }
            )
                .then((val) => {
                    console.log("valvalval" + val)
                    mMenu.update(
                        {
                            name: data.newName,
                            cuisineRegion: data.cuisineRegion,
                            isActive: data.isActive,
                            setPrice: data.setPrice,
                        }
                        , {
                            where:
                                {
                                    name: data.name
                                },
                        }).then((menu) => {
                        if (menu[0] > 0) {
                            resolve("Menu is updated successfully.");
                        } else {
                            reject("Menu could not be updated!");
                        }

                    }).catch(error => {
                        reject(error);
                    })
                }).catch(error => {
                reject(error);
            })
        }else{
            mMenu.update(
                {
                    name: data.newName,
                    cuisineRegion: data.cuisineRegion,
                    isActive: data.isActive,
                    setPrice: data.setPrice,
                }
                , {
                    where:
                        {
                            name: data.name
                        },
                }).then((menu) => {
                if (menu[0] > 0) {
                    resolve("Menu is updated successfully.");
                } else {
                    reject("Menu could not be updated!");
                }

            }).catch(error => {
                reject(error);
            })
        }
    })

}


function isExistsOnMenu(menuId,foodId) {
    /*
    Get All Food Of Menu
     */
    return new Promise((resolve, reject) => {
        mMenuFood.findOne({
            where: {
                menuId: menuId,
                foodId: foodId
            }
        }).then(data => {
            if (data != null && data != undefined) {
                resolve(true);
            }
            else
                resolve(false);
        }).catch(error => {
            reject(error);
        })

    })
}

function assignFoodToMenu(data) {
    /*
      data.menuName,data.foodName,data.quantity
     */
    return new Promise((resolve, reject) => {
        mMenu.findOne({
            where:
                {
                    name: data.menuName
                }
        })
            .then((menu) => {
                mFood.findOne({
                    where:
                        {
                            name: data.foodName
                        }
                }).then(food=>{
                    console.log("Menu:"+menu+"\n"+"Food:"+food)
                    isExistsOnMenu(menu.id,food.id).then(exists => {
                        if (!exists) {
                            menu.addFood(food.id)
                                .then(food => {
                                    console.log(food);
                                    resolve("Food is added to Menu successfully!");
                                })
                                .catch(error => {
                                    reject("Food could not be added to Menu!");
                                })

                        } else {
                            reject("Food already exists in Menu!");
                        }
                    })
                        .catch(error => {
                            reject(error);
                        })
                }).catch(error => {
                    reject(error);
                })

            })
            .catch(error => {
                reject(error);
            })
    })
}

function getActiveMenu() {
    console.log();
    return new Promise((resolve, reject) => {
        mMenu.findAll({
            where: {
                isActive: true
            },
            include: [
                {
                    model: mFood,
                    through: mMenuFood
                }
            ]
        }).then(data => {
            if (data[0] != null && data[0] != undefined) {
                resolve(JSON.stringify(data));
            }
            else
                reject("There is not a active Menu!");
        }).catch(error => {
            reject(error);
        })

    })
}

function getActiveMenu2() {
    console.log();
    return new Promise((resolve, reject) => {
        mMenu.findOne({
            where: {
                isActive: true
            },
        }).then(data => {
            if (data != null && data != undefined) {
                var mydata = data.getFood()
                console.log(JSON.stringify(mydata));
                resolve(JSON.stringify(data));
            }
            else
                reject("Cannot get the Menu's Food!");
        }).catch(error => {
            reject(error);
        })

    })
}


function deleteMenu(menuName) {
    /*
    menuName
     */
    return new Promise((resolve, reject) => {
        mMenu.destroy({
            where: {
                name: menuName
            }
        }).then(menu => {
            if (menu > 0)
                resolve('Menu is deleted');
            else
                reject("There is no food with name of : " + data.name);
        }).catch(error => {
            reject(error);
        })
    })
}


function addFoodToMenu(data) {
    /*

    */
    return new Promise((resolve, reject) => {

        var c = mMenu.getFoods().then(c => {
            console.log(c);
        }).catch(error => {
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

function deleteFoodFromMenu(menuName, foodName) {
    return new Promise((resolve, reject) => {
        mMenuFood.destroy({
            where: {
                foodName: foodName,
                menuName: menuName
            }
        }).then(menu => {
            if (menu > 0)
                resolve(foodName + ' from Menu is deleted!');
            else
                reject(foodName + " could not be deleted!");
        }).catch(error => {
            reject(error);
        })
    })
}

exports.getMenusFood = function (menuName) {
    /*
    Get All Food names of Menu
     */
    return new Promise((resolve, reject) => {
        mMenuFood.findAll({
            where: {
                menuName: menuName
            }
        }).then(result => {
            resolve(JSON.stringify(result[0]));
        }).catch(error => {
            reject(JSON.stringify(error));
        })
    }).catch(error => {
        reject(error);
    })
}

//Many to Many Example
function getFoodOfMenu(data) {
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
                    model: mFood,
                    through: mMenuFood
                }
            ]
        }).then(data => {
            if (data != null && data != undefined) {
                resolve(JSON.stringify(data));
            }
            else
                reject("Cannot get the Menu's Food!");
        }).catch(error => {
            reject(error);
        })

    })
}

function getAllMenu() {
    return new Promise((resolve, reject) => {
        mMenu.findAll({}).then(data => {
            if (data != null && data != undefined) {
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

    app.get('/menuManagement', function (request, response) {
        if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId)
            || checkUsersRole.isMatre(request.session.roleId))) {
            console.log('Menu');
            response.sendFile(path.resolve('public/Pages/menu.html'));
        } else {
            response.write(checkUsersRole.errorMesage(), () => {
                response.statusCode = 404;
                response.end();
            })
        }

    }),

        app.post('/api/menu/addMenu', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId))) {
                var data = request.body;
                data.cuisineRegion = data.cuisineRegion.trim();
                data.name = data.name.trim();
                if (checkDataType.isObjectValuesEmpty(data)) {
                    createMenuAndAssignFood(data).then(menu => {
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
                }
                else {
                    response.write(checkDataType.errorMesageEmpty().toString(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }
            }
                else {
                    response.write(checkUsersRole.errorMesage(), () => {
                        response.statusCode = 404;
                        response.end();
                    })
                }



        }),
        app.post('/api/menu/assignFoodToMenu', function (request, response) {
            var data = request.body;
            console.log("assignFoodToMenu" + data);

            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId))) {
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
            } else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        }),

        app.post('/api/menu/updateAMenu', function (request, response) {
            var data = request.body;
            console.log("updateAMenu");

            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId))) {

                if (!checkDataType.isString(data.name)) {
                    response.write(checkDataType.errorMesage(), () => {
                        response.statusCode = 400;
                        response.end();

                    })
                    return false;
                }
                else {
                console.log("Menu which will be updated = "+JSON.stringify(data))
                    updateAMenu(data).then(menu => {
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
                }
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }
        }),


        app.get('/api/menu/deleteMenu/:name', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isMatre(request.session.roleId))) {
                console.log('Delete Menu');
                var menuName = request.params.name;
                menuName = menuName.trim();
                if (!checkDataType.isString(menuName)) {
                    response.write(checkDataType.errorMesage(), () => {
                        response.statusCode = 400;
                        response.end();

                    })
                    return false;
                } else {
                    deleteMenu(menuName).then(menu => {
                        response.statusCode = 200;
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
                }
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        }),
        app.get('/api/menu/getMenu/:name', function (request, response) {
            console.log("Get a Food");
            let data = request.params;
            console.log(data);
            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isChef(request.session.roleId)
                || checkUsersRole.isChef(request.session.roleId))) {
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
            } else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }


        }),


        app.get('/api/menu/getFoodOfMenu/:menuName', function (request, response) {
            console.log("getFoodOfMenu");
            let data = request.params;
            console.log(data);

            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isWaiter(request.session.roleId))) {
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

    app.get('/api/menu/getAllMenu', function (request, response) {


        if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
            checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId)
            || checkUsersRole.isWaiter(request.session.roleId))) {
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

    }),
        app.get('/api/menu/getActiveMenu', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isWaiter(request.session.roleId))) {
                getActiveMenu().then(menu => {
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

        }),
        app.get('/api/menu/getActiveMenu2', function (request, response) {
            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isWaiter(request.session.roleId))) {
                getActiveMenu2().then(menu => {
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

        }),
        app.get('/api/menu/deleteFoodFromMenu/:menuName/:foodName', function (request, response) {

            if (request.session != undefined && (checkUsersRole.isAdmin(request.session.roleId) ||
                checkUsersRole.isChef(request.session.roleId) || checkUsersRole.isMatre(request.session.roleId)
                || checkUsersRole.isWaiter(request.session.roleId))) {
                let menuName = request.params.menuName;
                let foodName = request.params.foodName;
                deleteFoodFromMenu(menuName, foodName).then(menu => {
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

