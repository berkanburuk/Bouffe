var Order;
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
            seat1: {
                type: Sequelize.INTEGER
            }

        });
        Order.belongsTo(Beverage.getBeverage());
        Order.belongsTo(Food.getFood());
        Order.belongsTo(Waiter.getWaiter());

        Order.sync({
            //force: true
        }).then(() => {
            console.log("Order Table is created!");
        });
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Order = this.createOrder(Sequelize, sequelize, user);
            this.singletonInstance = Order;
            console.log("Singleton Class_Ord Created!");
        } else {
            Order = sequelize.model("order");
            console.log("Only one Order Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new OrderModel(Sequelize, sequelize, user);
    console.log("Order : " + f);
    // console.log(f.getUserTable())
}

function getAllOrders() {
    return Order.findAll().then(function (price) {
        console.log(price[0].get('price'));
    });
}

function save(order) {
    Order.create(order);
}

function getOrders() {
    return Order;
}

module.exports = {
    run, OrderModel, save, getOrders, getAllOrders
}