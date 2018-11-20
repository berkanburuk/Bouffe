var BeverageT;

class Beverage {
    createBeverage(Sequelize, sequelize, beverage) {
        BeverageT = sequelize.define(beverage, {
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

        BeverageT.sync({
            //force:true
        }).then(() => {
            console.log("Beverage Table is created!")
        });
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            BeverageT = this.createUser(Sequelize, sequelize, user);
            this.singletonInstance = UserTable;
            console.log("Singleton Class Created!");
        } else {
            BeverageT = sequelize.model("user");
            console.log("Only one Food Class can be created!");
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


module.exports = {
    Beverage, save, getBeverage, getAllBeverages
}