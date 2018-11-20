var MenuFood;
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
            },/*
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
                model: 'foods', // name of Target model
                key: 'id' // key in Target model that we're referencing
            }
        }
        */
        })
        //MenuFood.belongsTo(Menu.getMenu()); // Will add companyId to user
        MenuFood.belongsTo(Food.getFood());
        MenuFood.sync({
            //force: true
        }).then(()=>{
            console.log("MenuFood Table is created!")
        });
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            MenuFood = this.createMenuFood(Sequelize, sequelize, user);
            this.singletonInstance = MenuFood;
            console.log("Singleton Class_MFo Created!");
        } else {
            MenuFood = sequelize.model("menufood");
            console.log("Only one MenuFood Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new MenuFoodModel(Sequelize, sequelize, user);
    console.log("MenuFood : " + f);
    // console.log(f.getUserTable())
}

function getAllMenuFood() {
    MenuFood.findAll().then(function (id) {
        console.log(id[0].get('id'));
    });
}

function save(menuFood){
    MenuFood.create(menuFood)
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getMenuFood(){
    return MenuFood;
}

module.exports = {
   run, MenuFoodModel,getMenuFood,save,getAllMenuFood
}