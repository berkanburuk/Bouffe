var FoodTable;

class Food {

    createFood(Sequelize, sequelize, food) {
        //Creates the Content of Form
        let FoodTable = sequelize.define(food, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
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
        FoodTable.sync({
            //force: true
        })
            .then(() => {
                console.log("Food Table is created!");
            });
        return FoodTable;
    }

    constructor(Sequelize, sequelize, food) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            FoodTable = this.createFood(Sequelize, sequelize, food);
            this.singletonInstance = FoodTable;
            console.log("Singleton Class Created!");
        } else {
            FoodTable = sequelize.model("food");
            console.log("Only one Food Class can be created!");
        }

    }

    findByName() {
        FoodTable.findOne({
            name: 'deneme'
        })
            .then(user => {
                console.log('Found user: ${user}');
            })
    }

    getAllFood() {
        FoodTable.findAll().then(function (food) {
            console.log(food[0].get('name'));
        });
    }

}

function run(Sequelize, sequelize, food) {
    var f = new Food(Sequelize, sequelize, food);
    console.log("Food->" + f);
    console.log("Food " + f.getFoodTable());
    let saveTable = f.save('');
}

function save(food) {
    //FoodTable.create(food);
    FoodTable.create({
        type: 'asd',
        name: 'asd',
        description: 'asd',
        available: true,
        price: 10
    }).then(() => {
        console.log("Food is Added!");
    })
}

function getFoodTable() {
    return FoodTable;
}

module.exports = {
    run,Food,save
}