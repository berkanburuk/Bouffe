
var MenuFood;
var Menu = require('./Menu');
var Food = require('./Food');
function createMenuFood(Sequelize,sequelize,menuFood){
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
    MenuFood.belongsTo(Menu.getMenu()); // Will add companyId to user
    MenuFood.belongsTo(Food.getFood());
    MenuFood.sync({
        //force: true
    }).then(()=>{
        console.log("MenuFood Table is created!")
    });

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
    createMenuFood,getMenuFood,save,getMenuFood
}