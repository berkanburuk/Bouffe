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
                defaultValue: 0
                //0 -> default Value(Just Ordered) -> Şefin önüne onaylanması için düşecek
                //1 -> Chef OK dedi.
                //2 -> Chef yemek hazır dedi. waiter önüne düşecek.
                //3 -> Waiter onaylayacak. Bitecek
                //4 -> Şef reject edecek->
                //5 -> Waiter reject mesajı gidecek
            },isBeverageReady:{
                type:Sequelize.INTEGER,
                defaultValue: 0
                //0 -> default Value(Just Ordered)-> bartender önüne düşecek -> 1 e update
                //1 ->Bartender Ok dicek-> 2 ye update
                //2 ->Waiter önüne düşecek -> 3 e update
                //3 -> done
                //4 -> BArtender reject edecek->
                //5 -> Waiter reject mesajı gidecek
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
        const mOrderFood = sequelize.define('orderFood', {})
        Order.belongsToMany(mFood,{through: mOrderFood,targetKey:'id',onDelete: 'CASCADE'});


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

//chef onaylıyor (1) yapıyor, Garsona Food onaylandı görünecek
exports.maltreApprovesOrder = function (orderId) {
        return new Promise((resolve, reject) => {
            Order.update(
                {
                    isFoodReady: 1
                },
                {
                where:
                    {
                        id: orderId,
                    }
            }).then((order)=>{
                console.log(order);
                if (order>0)
                resolve("Chef approved.");
                else
                    reject('Chef did not approve!');
            })
                .catch(error =>{
                    reject(error);
                })
        })
    }


//Garson get Food Onaylandı
exports.getWaiterFoodApproved = function (orderId) {
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 1
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}

//chef onaylıyor (2) Yemek hazır. Garson
exports.chefApprovesFoodReady = function (orderId) {
    return new Promise((resolve, reject) => {
        Order.update({
            where:
                {
                    id: orderId,
                    isFoodReady: 2
                }
        }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}

//Waiter Food Ready mesajını alıyor.
exports.getWaiterNotificationApprovedFood = function(orderId){
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 2
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}



//Waiter 3'e setleyip, yemek teslim edildi. Successfull
exports.waiterCloseOrder = function (orderId) {
    return new Promise((resolve, reject) => {
        Order.update({
            where:
                {
                    id: orderId,
                    isFoodReady: 3
                }
        }).then((order)=>{
            console.log(order);
            if (order>0)
                resolve("Chef approved.");
            else
                reject('Chef did not approve!');
        })
            .catch(error =>{
                reject(error);
            })
    })
}


exports.getWaiterFoodDone = function(orderId){
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 3
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}

exports.getFoodRejected = function(orderId){
    return new Promise((resolve, reject) => {
        Order.findOne({
            where:
                {
                    id: orderId,
                    isFoodReady: 4
                }
        }).then((order) => {
            resolve(JSON.stringify(order));
        }).catch(error=>{
            reject(error);
        })
    })
}



//0 -> default Value(Just Ordered) -> Şefin önüne onaylanması için düşecek
//1 -> Chef OK dedi.
//2 -> Chef yemek hazır dedi. waiter önüne düşecek.
//3 -> Waiter onaylayacak. Bitecek
//4 -> Şef reject edecek->
//5 -> Waiter reject mesajı gidecek