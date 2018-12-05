var Order;

class OrderModel {

    createOrder(Sequelize, sequelize, order) {
        Order = sequelize.define(order, {
            //constructor(id, name, type, desc, available, price) {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            note: {
                type: Sequelize.STRING
            },
            isPaid:{
                type:Sequelize.BOOLEAN
            },
            isFoodReady:{
              type:Sequelize.INTEGER

            },isBeverageReady:{
                type:Sequelize.INTEGER
//0 -> default Value(Just Ordered)
//1 -> if chef notification, if waiter notification
//3 -> done
//4 -> reject
            }
        });
        //Foreign Keys
        let mChair = sequelize.model('chair');
        let mPayment = sequelize.model('payment');
        //let mUser = sequelize.model('user');
        //Order.belongsTo
        Order.belongsTo(mChair);
        Order.belongsTo(mPayment);

        //OrderBeverage
        const mBeverage = sequelize.define('beverage', {})
        const mOrderBeverage = sequelize.define('orderBeverage', {})

        Order.belongsToMany(mBeverage,{through: mOrderBeverage});

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
    run
}