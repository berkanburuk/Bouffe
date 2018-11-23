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
            chairId: {
                type:Sequelize.INTEGER,
                references: {
                    model: 'chairs', // name of Target model
                    key: 'id' // key in Target model that we're referencing
                }
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
                //0 -> chef notification
                //1 -> waiter notification
                //2 -> done
                //3 -> reject
            },
            username:{
                type:Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username'
                }
            },
            paymentId:{
              type:Sequelize.INTEGER,
              references:{
                  model:'payments',
                  key:'id'
              }
            }

        });
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