var Menu;
var sequ = require('../Util/DatabaseConnection').getSeq;

class MenuModel {
    /*
    createMenu23(Sequelize, sequelize, menu) {
        // noinspection JSAnnotator
        return new Promise(function (resolve, reject) {
            Menu = sequelize.define(menu, {
                //constructor(id, name, type, desc, available, price) {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                cousinRegion: {
                    type: Sequelize.STRING,
                    allowNull: false
                }

            }).catch(error => {
                reject("burası reject");
            })
            Menu.sync({
                //force: true
            }).then(() => {
                resolve(Menu)
            });

        });
    }
    */
    createMenu(Sequelize, sequelize, menu) {
        // noinspection JSAnnotator
            Menu = sequelize.define(menu, {
                //constructor(id, name, type, desc, available, price) {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                cousinRegion: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            })
            Menu.sync({
                //force: true
            })
        return Menu;
    }




    constructor(Sequelize, sequelize, menu) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Menu = this.createMenu(Sequelize, sequelize, menu);
            this.singletonInstance = Menu;
            console.log("Singleton Menu Created!" + Menu);
        } else {
            Menu = sequelize.model("menu");
            console.log("Only one Menu Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, menu) {
    var f = new MenuModel(Sequelize, sequelize, menu);
    console.log("Menu : " + f);


}


function getMenus() {
    Menu.findAll().then(function (menu) {
        console.log(menu[0].get('name'));
    });
}

function getMenuModel(){
    let s = sequ();
    let mMenu = s.model("menu");
    return mMenu;
}

function save(data) {
    let mMenu = getMenuModel();
    mMenu.create(data)
        .then(newUser => {
            console.log(newUser.id);
        });
}


module.exports = {
    run,  save, getMenus,getMenuModel
}