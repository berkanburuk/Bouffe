var OrderBeverage;
var sequ = require('../Util/DatabaseConnection').getSeq;
var Menu = require('./Menu');
var Food = require('./Food');

class OrderBeverageModel{
    createOrderBeverage(Sequelize,sequelize,orderBeverage){
        OrderBeverage = sequelize.define(orderBeverage, {
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
        beverageId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'beverages', // name of Target model
                key: 'id' // key in Target model that we're referencing
            }
        },
            quantity:{
                type: Sequelize.INTEGER
            }

        })
        //OrderBeverage.belongsTo(Menu.getMenu()); // Will add companyId to user
        //OrderBeverage.belongsTo(Food.getFood());
        OrderBeverage.sync({
            //force: true
        }).then(()=>{
            console.log("OrderBeverage Table is created!");
        });
        return OrderBeverage;
    }

    constructor(Sequelize, sequelize, orderBeverage) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            OrderBeverage = this.createOrderBeverage(Sequelize, sequelize, orderBeverage);
            this.singletonInstance = OrderBeverage;
            console.log("Singleton Class_MFo Created!");
        } else {
            OrderBeverage = sequelize.model("orderBeverage");
            console.log("Only one OrderBeverage Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, orderBeverage) {
    var f = new OrderBeverageModel(Sequelize, sequelize, orderBeverage);
    console.log("OrderBeverage : " + f);
    // console.log(f.getUserTable())
}

function getOrderBeverages() {
    OrderBeverage.findAll().then(function (id) {
        console.log(id[0].get('id'));
    });
}

function getOrderBeverageModel(){
    let s = sequ();
    let mOrderBeverage = s.model("orderBeverage");
    return mOrderBeverage;
}

function save(data) {
    let mOrderBeverage = getOrderBeverageModel();
    mOrderBeverage.create(data)
        .then(newUser => {
            console.log(newUser.id);
        });
}

module.exports = {
    run, OrderBeverageModel,save,getOrderBeverageModel,getOrderBeverages
}