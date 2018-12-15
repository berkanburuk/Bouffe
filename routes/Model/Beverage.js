var Beverage;

class BeverageModel {
    createBeverage(Sequelize, sequelize, beverage) {
        Beverage = sequelize.define(beverage, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.DOUBLE
            }
        })

        let mOrder = sequelize.model('order');
        let mOrderBeverage= sequelize.model('orderBeverage');
        Beverage.belongsToMany(mOrder,{through: mOrderBeverage});

        return Beverage;
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Beverage = this.createBeverage(Sequelize, sequelize, user);
            this.singletonInstance = Beverage;
            console.log("Singleton Beverage Created!" + Beverage);
        } else {
            Beverage = sequelize.model("beverage");
            console.log("Only one Beverage Class can be created!");
        }

    }
}

exports.run = function (Sequelize, sequelize, beverage) {
    var f = new BeverageModel(Sequelize, sequelize, beverage);
    console.log("Beverage : " + f);
  //  console.log(f.getUserTable())
}
