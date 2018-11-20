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
            available: {
                type: Sequelize.BOOLEAN
            },
            price: {
                type: Sequelize.DOUBLE
            }
        })

        Beverage.sync({
            //force:true
        }).then(() => {
            console.log("Beverage Table is created!")
        });
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Beverage = this.createBeverage(Sequelize, sequelize, user);
            this.singletonInstance = Beverage;
            console.log("Singleton Class_Bev Created!");
        } else {
            Beverage = sequelize.model("beverage");
            console.log("Only one Beverage Class can be created!");
        }

    }
}

function save(beverage) {
    console.log("Function Of Beverage - Save");
    Beverage.create(beverage)
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getAllBeverages() {
    Beverage.findAll().then(function (beverage) {
        console.log(beverage[0].get('name'));
    });
}

function getBeverage() {
    return Beverage;
}


function run(Sequelize, sequelize, user) {
    var f = new BeverageModel(Sequelize, sequelize, user);
    console.log("Beverage : " + f);
  //  console.log(f.getUserTable())
}

module.exports = {
   run, BeverageModel, save, getBeverage, getAllBeverages
}