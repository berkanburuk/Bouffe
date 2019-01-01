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
                type:Sequelize.BOOLEAN,
                defaultValue: false
            },
            isFoodReady:{
              type:Sequelize.INTEGER,
                defaultValue: -1
                //-1 -> Food Order'ı verilmedi
                //0 -> default Value(Just Ordered) -> Şefin önüne onaylanması için düşecek
                //1 -> Chef OK dedi. update 2
                //2 -> Chef yemek hazır dedi. waiter önüne düşecek.
                //3 -> Waiter onaylayacak. Bitecek
                //4 -> Şef reject edecek->
                //5 -> Waiter reject mesajı gidecek
            },isBeverageReady:{
                type:Sequelize.INTEGER,
                defaultValue: -1
                //-1 -> Beverage Order'ı verilmedi
                //0 -> default Value(Just Ordered)-> bartender önüne düşecek ->
                //1 ->Bartender Approved -> Bartender updates 2
                //2 ->Ready -> Waiter updates 3
                //3 -> Waiter finish execution
                //4 -> BArtender reject edecek - Waiter reject mesajı gidecek -> yapıldı Price düşüyor.

            },
            orderOpen: {
                type:Sequelize.BOOLEAN,
                defaultValue: true
        }
        });
        //Foreign Keys
        //let mChair = sequelize.model('chair');
        //Order.belongsTo(mChair);
        //Payment FK
        /*
        let mPayment = sequelize.model('payment');
        Order.belongsTo(mPayment);
*/
    /*
        //Table FK
        Order.belongsTo(mTable,{targetKey:'id', onDelete: 'CASCADE'});
        Order.belongsTo(mTable,{onDelete: 'CASCADE'});
    */
        let mTable= sequelize.model('table');
        let mOrderTable= sequelize.define('orderTable',{});
        Order.belongsToMany(mTable,{through: mOrderTable,targetKey:'id', onDelete: 'CASCADE'});


/*
        //OrderMenu FK
        const mMenu = sequelize.define('menu', {})
        const mOrderMenu = sequelize.define('orderMenu', {})
        Order.belongsToMany(mMenu,{targetKey:'id', through: mOrderMenu});
*/
        //OrderFood FK
        const mFood = sequelize.define('food', {})
        const mOrderFood = sequelize.define('orderFood', {
            isFoodReady:{
                type:Sequelize.INTEGER,
                defaultValue: -1
                //-1 -> Food Order'ı verilmedi
                //0 -> default Value(Just Ordered) -> Şefin önüne onaylanması için düşecek
                //1 -> Chef OK dedi. update 2
                //2 -> Chef yemek hazır dedi. waiter önüne düşecek.
                //3 -> Waiter onaylayacak. Bitecek
                //4 -> Şef reject edecek->
                //5 -> Waiter reject mesajı gidecek
            }
        })
        //let mOrderFood  = sequelize.model("orderFood");
        Order.belongsToMany(mFood,
            {
                through: mOrderFood,
                //targetKey:'name',
                onDelete: 'CASCADE'}
                );
        //OrderBeverage FK
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

exports.run = function(Sequelize, sequelize, order) {
    var f = new OrderModel(Sequelize, sequelize, order);
    console.log("Order : " + f);
}

//0 -> default Value(Just Ordered) -> Şefin önüne onaylanması için düşecek
//1 -> Chef OK dedi.
//2 -> Chef yemek hazır dedi. waiter önüne düşecek.
//3 -> Waiter onaylayacak. Bitecek
//4 -> Şef reject edecek->
//5 -> Waiter reject mesajı gidecek