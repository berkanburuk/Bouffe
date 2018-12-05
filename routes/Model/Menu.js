var Menu;

class MenuModel {

        createMenu(Sequelize, sequelize, menu) {
            Menu = sequelize.define(menu, {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    type: Sequelize.INTEGER
                },
                name:{
                    type:Sequelize.STRING
                },
                cousinRegion:{
                    type:Sequelize.STRING
                },
                isApprovedByDecan:{
                    type:Sequelize.BOOLEAN,
                    default:false
                }
            })
            //Order FK
            let mOrder = sequelize.model('order');
            Menu.belongsTo(mOrder);

            //Food FK
            let mFood = sequelize.model('food');
            let mMenuFood = sequelize.model('menuFood');

            Menu.belongsToMany(mFood,
                {
                    through: mMenuFood
                });
            /*
            Menu.sync({
                //force:true
            }).then(() => {
                console.log("Menu Table is created!")
            });
            mMenuFood.sync({
                //force:true
            }).then(() => {
                console.log("MenuFood Table is created!")
            });
            */
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



module.exports = {
    run
}