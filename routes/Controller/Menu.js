let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mMenu = db.model(dbNames.menu);


const save = (data)=>{
    return new Promise((resolve,reject)=>{
        mMenu.create(data).then(menu=> {
            console.log(menu.get())
            resolve(menu);
        }).catch(error => {
            reject(error + 'Cannot create the menu!');
        });
    })
}

const getAMenu = (name) => {
    return new Promise((resolve, reject) => {
        mMenu.findOne({
            where:{
                'name':name
            }
        }).then(menu=>{
            resolve(menu.get());
        }).catch(error => {
            reject(error + "\nCannot get the Menu!");
        })
    });
}


const getAllMenu = () => {
    return new Promise((resolve, reject) => {
        mMenu.findAll({
                //   attributes: ['foo', 'bar']
            }
        ).then(menu=>{
            resolve(menu.get());
        }).catch(error => {
            reject(error + "\nCannot get all Menu");
        })
    });
}
//primaryKey  = name olmalı
const deleteMenu = (name) =>{
    return new Promise((resolve,reject)=>{
        mMenu.destroy({
            where: {
                'name': name
            }
        }).then(menu=>{
            resolve(menu + 'Menu is deleted');
        }).catch(error =>{
            reject(error + ' Menu could not be deleted!');
        })
    })
}

module.exports = function (app) {

    app.get('/menu'), function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/Menu.html'));

    },

        app.post('/api/:menu/:addMenu/'), function (request, response, next) {
            var data = request.body;
            //menusController.create(data);
            response.status= 200;
            response.end();
            next();
        },
        app.delete('/api/:menu/:deleteMenu'), function(request, response){
            console.log('going to delete', request.body);

            response.end();
        }

}



/*
        function getMenu(Menu) {
        var u ={};
            Menu.findAndCountAll().then(function (result) {
                //console.log(result.count);
                for (var i=0;i<result.count;i++){
                    u.name = result[0].get('name');
                    u.type =result[0].get('type');
                    u.description = result[0].get('description');
                        u.available =result[0].get('available');
                        u.price = result[0].get('price');
                }
            });
            return u;
        }
        */
