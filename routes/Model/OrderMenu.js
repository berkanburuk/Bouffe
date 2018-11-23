var OrderMenu;

class OrderMenuModel{
    createOrderMenu(Sequelize,sequelize,orderFood){
        OrderMenu = sequelize.define(orderFood, {
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
            menuId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'menus', // name of Target model
                    key: 'id' // key in Target model that we're referencing
                }
            },
            quantity:{
                type: Sequelize.INTEGER
            }

        })
        OrderMenu.sync({
            //force: true
        }).then(()=>{
            console.log("OrderFood Table is created!")
        });
        return OrderMenu;
    }

    constructor(Sequelize, sequelize, orderMenu) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            OrderMenu = this.createOrderMenu(Sequelize, sequelize, orderMenu);
            this.singletonInstance = OrderMenu;
            console.log("Singleton Class_MFo Created!");
        } else {
            OrderMenu = sequelize.model("orderFood");
            console.log("Only one OrderFood Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new OrderMenuModel(Sequelize, sequelize, user);
    console.log("Order Menu : " + f);
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
    run
}