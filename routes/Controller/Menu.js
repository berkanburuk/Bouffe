let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mMenu = db.model(dbNames.menu);



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
            })
            .catch(error => {
                reject(error);
            })
    })
        .catch(error=>{
        reject(error);
    })
}



function createMenu(data){

    return new Promise((resolve, reject) => {
        mMenu.findOrCreate({
            where:
                {
                    name: data.name
                },
            defaults:
                {
                    name: data.name,
                    cousinRegion: data.cousinRegion,
                    date: data.date,
                    setPrice:data.setPrice
                }
        }).then((menu)=>{
            console.log(menu[0].get(0));
            menu[0].addFoods(data.foodName).then(()=>{
                resolve("Food is added!");
            }).catch(error=>{
                reject("Food could not be added!");
            })
        })
            .catch(error =>{
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

module.exports = function (app) {

    app.get('/menu', function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/Menu.html'));

    }),

        app.post('/api/menu/addMenu', function (request, response) {
            var data = request.body;
            createMenu(data).then(menu => {
                response.statusCode = 200;
                console.log(menu);
                response.write(menu, () => {
                    response.end();
                });
            }).catch(error => {
                response.statusCode(404);
                console.log(error);
                response.write(error, () => {
                    response.end();
                });
            })
        }),
                app.get('/api/menu/deleteMenu/:name', function (request, response) {
                    console.log('Delete Menu');
                    var data = request.params;
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

                }),
        app.get('/api/menu/getMenu/:name', function (request, response ) {
            console.log("Get a Food");

            var data = request.params;
            console.log(data);

            getMenu(data).then(menu=> {
                response.statusCode = 200;
                console.log(menu);
                response.write(menu.toString(),()=>{
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

