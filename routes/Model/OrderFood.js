var OrderFood;
var sequ = require('../Util/DatabaseConnection').getSeq;
var Menu = require('./Menu');
var Food = require('./Food');

class OrderFoodModel{
    createOrderFood(Sequelize,sequelize,orderFood){
        OrderFood = sequelize.define(orderFood, {
            //constructor(id, name, type, desc, available, price) {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
        orderId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'orders', // name of Target model
                key: 'id' // key in Target model that we're referencing
            }
        },
        foodId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'food', // name of Target model
                key: 'id' // key in Target model that we're referencing
            }
        },
            quantity:{
                type: Sequelize.INTEGER
            }

        })
        //OrderFood.belongsTo(Menu.getMenu()); // Will add companyId to user
        //OrderFood.belongsTo(Food.getFood());
        OrderFood.sync({
            //force: true
        }).then(()=>{
            console.log("OrderFood Table is created!")
        });
        return OrderFood;
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            OrderFood = this.createOrderFood(Sequelize, sequelize, user);
            this.singletonInstance = OrderFood;
            console.log("Singleton Class_MFo Created!");
        } else {
            OrderFood = sequelize.model("orderFood");
            console.log("Only one OrderFood Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new OrderFoodModel(Sequelize, sequelize, user);
    console.log("OrderFood : " + f);
    // console.log(f.getUserTable())
}

function getOrderFoods() {
    OrderFood.findAll().then(function (id) {
        console.log(id[0].get('id'));
    });
}

function getOrderFoodModel(){
    let s = sequ();
    let mOrderFood = s.model("orderFood");
    return mOrderFood;
}

function save(data) {
    let mOrderFood = getOrderFoodModel();
    mOrderFood.create(data)
        .then(newUser => {
            console.log(newUser.id);
        });
}

module.exports = {
    run, OrderFoodModel,save,getOrderFoodModel,getOrderFoods
}