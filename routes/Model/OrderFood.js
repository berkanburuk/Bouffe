var OrderFood;

class OrderFoodModel {

    createOrder(Sequelize, sequelize, orderModel) {
        OrderFood = sequelize.define(orderModel, {

            foodName: {
                type: Sequelize.STRING,
                references: 'food', // <<< Note, its table's name, not object name
                referencesKey: 'foodName' // <<< Note, its a column name
            },
            orderId: {
                type: Sequelize.INTEGER,
                references: 'orders', // <<< Note, its table's name, not object name
                referencesKey: 'id' // <<< Note, its a column name
            }
        });
    }

    constructor(Sequelize, sequelize, orderModel) {
        OrderFood = this.createOrder(Sequelize, sequelize, orderModel);
    }
}

exports.run = function(Sequelize, sequelize, orderModel) {
    var f = new OrderFoodModel(Sequelize, sequelize, orderModel);
    console.log("OrderFood: " + f);
}
