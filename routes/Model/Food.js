var Food;

class FoodModel {
    createFood(Sequelize, sequelize, food) {
        //Creates the Content of Form
         Food = sequelize.define(food, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
             name: {
                 type: Sequelize.STRING,
                 allowNull: false
             },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            available: {
                type: Sequelize.BOOLEAN
            },
            price: {
                type: Sequelize.DOUBLE
            }
        });
        //FoodTable.belongsTo(Order, {foreignKey: 'fk_Order',targetKey:'foodId'});
        Food.sync({
            //force: true
        })
            .then(() => {
                console.log("Food Table is created!");
            });
        return Food;
    }

    constructor(Sequelize, sequelize, food) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Food = this.createFood(Sequelize, sequelize, food);
            this.singletonInstance = Food;
            console.log("Singleton Class_Foo Created!" + Food);
        } else {
            Food = sequelize.model("food");
            console.log("Only one Food Class can be created!");
        }

    }
}

function run(Sequelize, sequelize, food) {
    var f = new FoodModel(Sequelize, sequelize, food);
    console.log("Food->" + f);
//    console.log("Food " + f.getFoodTable());
//    let saveTable = f.save('');
}

function getAllFood() {
    Food.findAll().then(function (food) {
        console.log(food[0].get('name'));
    });
}

module.exports = {
    run
}