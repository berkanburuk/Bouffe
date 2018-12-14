var Menu;

class MenuModel {

        createMenu(Sequelize, sequelize, menu) {
            Menu = sequelize.define(menu, {
                name:{
                    primaryKey: true,
                    type:Sequelize.STRING
                },
                cuisineRegion:{
                    type:Sequelize.STRING
                },
                date: {
                    type: Sequelize.DATE
                },
                setPrice:{
                    type:Sequelize.DOUBLE
                }
            })
            /*
            //Order FK
            let mOrder = sequelize.model('order');
            Menu.belongsTo(mOrder);
            */
            //Food FK
            let mFood = sequelize.model('food');
            let mMenuFood = sequelize.model('menuFood');
            Menu.belongsToMany(mFood,
                {
                    through: mMenuFood,
                    targetKey:'name',
                    onDelete: 'CASCADE'
                });


            //OrderMenu
            let mOrder = sequelize.model('order');
            let mOrderMenu = sequelize.model('orderMenu');
            Menu.belongsToMany(mOrder,{
                through: mOrderMenu,
                    targetKey:'name',
                onDelete: 'CASCADE'
            });




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

exports.run = function (Sequelize, sequelize, menu) {
    var f = new MenuModel(Sequelize, sequelize, menu);
    console.log("Menu : " + f);

}


