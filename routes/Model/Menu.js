var Menu;

class MenuModel {
    createMenu(Sequelize, sequelize, menu) {
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

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Menu = this.createMenu(Sequelize, sequelize, user);
            this.singletonInstance = Menu;
            console.log("Singleton Class_Men Created!");
        } else {
            Menu = sequelize.model("menu");
            console.log("Only one Menu Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new MenuModel(Sequelize, sequelize, user);
    console.log("Menu : " + f);
 //  console.log(f.getUserTable())

}

function getMenu() {
    return Menu;
}

function getAllMenu() {
    Menu.findAll().then(function (menu) {
        console.log(menu[0].get('name'));
    });
}

function save() {

}

module.exports = {
    run, MenuModel, save, getMenu, getAllMenu
}