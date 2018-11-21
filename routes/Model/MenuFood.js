var MenuFood;
var sequ = require('../Util/DatabaseConnection').getSeq;
var Menu = require('./Menu');
var Food = require('./Food');

class MenuFoodModel{
    createMenuFood(Sequelize,sequelize,menuFood){
        MenuFood = sequelize.define(menuFood, {
            //constructor(id, name, type, desc, available, price) {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
        menuId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'menus', // name of Target model
                key: 'id' // key in Target model that we're referencing
            }
        },
        foodId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'food', // name of Target model
                key: 'id' // key in Target model that we're referencing
            }
        }

        })
        //MenuFood.belongsTo(Menu.getMenu()); // Will add companyId to user
        //MenuFood.belongsTo(Food.getFood());
        MenuFood.sync({
            //force: true
        }).then(()=>{
            console.log("MenuFood Table is created!")
        });
        return MenuFood;
    }

    constructor(Sequelize, sequelize, menuFood) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            MenuFood = this.createMenuFood(Sequelize, sequelize, menuFood);
            this.singletonInstance = MenuFood;
            console.log("Singleton Class_MFo Created!" + MenuFood);
        } else {
            MenuFood = sequelize.model("menufood");
            console.log("Only one MenuFood Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, menuFood) {
    var f = new MenuFoodModel(Sequelize, sequelize, menuFood);
    console.log("MenuFood : " + f);
    // console.log(f.getUserTable())
}

function getAllMenuFood() {
    MenuFood.findAll().then(function (id) {
        console.log(id[0].get('id'));
    });
}

function getMenuFoodModel(){
    let s = sequ();
    let mMenuFood = s.model("menuFood");
    return mMenuFood;
}

function save(data) {
    let mMenuFood = getMenuFoodModel();
    mMenuFood.create(data)
        .then(newUser => {
            //console.log(newUser.id);
        });
}

module.exports = {
   run, MenuFoodModel,save,getAllMenuFood,getMenuFoodModel
}