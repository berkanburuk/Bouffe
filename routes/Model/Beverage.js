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
                type: Sequelize.BOOLEAN,
                default:true
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

function getBeverageModel(){
    let s = sequelize();
    let sequ = s.model("beverage");
    return mBeverage;
}

function save(data) {
    let mBeverage = getInstructorModel();
    mBeverage.create(data)
        .then(newUser => {
            console.log(newUser.id);
        });
}

function getBeverages() {
    Beverage.findAll().then(function (beverage) {
        console.log(beverage[0].get('name'));
    });
}

function run(Sequelize, sequelize, beverage) {
    var f = new BeverageModel(Sequelize, sequelize, beverage);
    console.log("Beverage : " + f);
  //  console.log(f.getUserTable())
}

module.exports = {
   run, BeverageModel, save, getBeverages
}