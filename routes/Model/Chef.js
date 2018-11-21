var Chef;
var sequ = require('../Util/DatabaseConnection').getSeq;

class ChefModel {
    createChef(Sequelize, sequelize, chef) {
        //Creates the Content of Form
        Chef = sequelize.define(chef, {
            username:{
                type:Sequelize.STRING,
                references: {
                    model: 'users', // name of Target model
                    key: 'username' // key in Target model that we're referencing
                }
            }, roleId:{
                type:Sequelize.INTEGER,
                references: {
                    model: 'roles', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                    onDelete :'cascade',
                    onUpdate :'cascade'
                }
            },
            approve: {
                type: Sequelize.BOOLEAN
            }

        });
        //FoodTable.belongsTo(Order, {foreignKey: 'fk_Order',targetKey:'foodId'});
        Chef.sync({
            //force: true
        })
            .then(() => {
                console.log("Food Table is created!");
            });
        return Chef;
    }

    constructor(Sequelize, sequelize, chef) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Chef = this.createChef(Sequelize, sequelize, chef);
            this.singletonInstance = Chef;
            console.log("Singleton Chef Created!" + Chef);
        } else {
            Chef = sequelize.model("chef");
            console.log("Only one Food Class can be created!");
        }

    }
}

function run(Sequelize, sequelize, chef) {
    var f = new ChefModel(Sequelize, sequelize, chef);
    console.log("Chef->" + f);
//    console.log("Food " + f.getFoodTable());
//    let saveTable = f.save('');
}

function findByName(_name) {
    Food.findOne({
        name: _name
    })
        .then(user => {
            console.log('Found user: ${user}');
        })
}

function getChefs() {
    Food.findAll().then(function (chef) {
        console.log(chef[0].get('name'));
    });
}

function save(data) {
    let mChef = getChefModel();
    mChef.create(data)
        .then(newUser => {
            console.log(newUser.username);
        });
}

function getChefModel(){
    let s = sequ();
    let mChef = s.model("chef");
    return mChef;
}

module.exports = {
    run, save, getChefs,getChefModel,findByName
}