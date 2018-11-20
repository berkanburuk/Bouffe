var Order;
var Beverage = require('./Beverage');
var Food = require('./Food');
var Waiter = require('./Waiter');
function createOrder (Sequelize,sequelize,order){
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

        date:{
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
            }).then(()=>{
            console.log("Order Table is created!");
            });

}

function getAllOrders() {
    return Order.findAll().then(function (price) {
        console.log(price[0].get('price'));
    });
}

function save(order){
    Order.create(order);
}

function getOrder(){
return Order;
}

module.exports = {
    createOrder,getOrder,save
}