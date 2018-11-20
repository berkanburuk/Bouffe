var Menu;

class Menu {
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
            Menu = this.createUser(Sequelize, sequelize, user);
            this.singletonInstance = UserTable;
            console.log("Singleton Class Created!");
        } else {
            Menu = sequelize.model("user");
            console.log("Only one Menu Class can be created!");
        }

    }
    getAllMenu() {
        Menu.findAll().then(function (menu) {
            console.log(menu[0].get('name'));
        });
    }
}

function run(Sequelize, sequelize, user) {
    var f = new Menu(Sequelize, sequelize, user);
    console.log("Menu : " + f);
    console.log(f.getUserTable())

}
function save() {

}

function getMenu() {
    return Menu;
}

module.exports = {
    createMenu, getMenu, save, getMenu
}