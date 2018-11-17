var Food;

/*
class Food {
    constructor(id, name, type, description, available, price) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.availabe = available;
        this.price = price;
    }

}
*/

function createFood(Sequelize,sequelize,food){
    Food = sequelize.define(food, {
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

    //Food.hasOne(Orders);
    //Food.belongsTo(Order, {foreignKey: 'fk_Order',targetKey:'foodId'});
    Food.sync({
                //force: true
            })
                .then(()=>{
        console.log("Food Table is created!");
    });



}


function getFood(){
    return Food;
}


function findByName() {
    Food.findOne({
        name: 'deneme'
    })
        .then(user => {
            console.log('Found user: ${user}');
        })
}


function getAllFood() {
    Food.findAll().then(function (food) {
        console.log(food[0].get('name'));
    });
}

function save(food){
    //Food.create(food);
    Food.create({
        name: 'deneme',
        type: 'deneme',
        description : 'des',
        available :true,
        price: 4
    })
        .then(newUser => {
            console.log(newUser.name);
        });
}


module.exports = {
    createFood,getFood,findByName,save
}
