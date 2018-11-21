var Order;
var sequ = require('../Util/DatabaseConnection').getSeq;
var Beverage = require('./Beverage');
var Food = require('./Food');
var Waiter = require('./Waiter');

class OrderModel {
    createOrder(Sequelize, sequelize, order) {
        Order = sequelize.define(order, {
            //constructor(id, name, type, desc, available, price) {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            chairId: {
                type:Sequelize.INTEGER
            },
            orderBeverageId:{
                type: Sequelize.INTEGER
            },
            orderFoodId :{
                type: Sequelize.INTEGER
            },
            price: {
                type: Sequelize.DOUBLE
            },
            paymentType: {
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            note: {
                type: Sequelize.STRING
            },

            username:{
                type: Sequelize.STRING
            }
        });
        /*
        Order.belongsTo(Beverage.getBeverage());
        Order.belongsTo(Food.getFood());
        Order.belongsTo(Waiter.getWaiter());
*/
        Order.sync({
            //force: true
        }).then(() => {
            console.log("Order Table is created!");
        });
        return Order;
    }

    constructor(Sequelize, sequelize, order) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Order = this.createOrder(Sequelize, sequelize, order);
            this.singletonInstance = Order;
            console.log("Singleton Class_Ord Created!");
        } else {
            Order = sequelize.model("order");
            console.log("Only one Order Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, order) {
    var f = new OrderModel(Sequelize, sequelize, order);
    console.log("Order : " + f);
    // console.log(f.getUserTable())
}

function getAllOrders() {
    return Order.findAll().then(function (price) {
        console.log(price[0].get('price'));
    });
}

function getOrderModel(){
    let s = sequ();
    let mOrder = s.model("order");
    return mOrder;
}

function save(data) {
    let mOrder = getOrderModel();
    mOrder.create(data)
        .then(newUser => {
           // console.log(newUser.id);
        });
}


module.exports = {
    run, OrderModel, save, getAllOrders,getOrderModel
}