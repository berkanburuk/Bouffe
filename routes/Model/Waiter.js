var Waiter;
var Role = require('./Role');
var Student = require('./Student');

class WaiterModel{
    createWaiter(Sequelize, sequelize, waiter) {
        Waiter = sequelize.define(waiter, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            assignedTables: {
                type: Sequelize.INTEGER
            }
        });
        //Waiter.belongsTo(Role.getRole(),{foreignKey: 'fk_WaiterRoleName', targetKey: 'id'});
        Waiter.belongsTo(Role.getRole());
        /*
                Waiter.belongsTo(Student.getStudent(),{
                    //onUpdate: 'cascade',
                    keyType: Sequelize.STRING,
                    foreignKey: 'username',
                    targetKey: 'username'
                });

        */
        Waiter.sync({
            //force:true
        }).then(() => {
            console.log("Waiter Table is created!")
        });
    }
    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Waiter = this.createWaiter(Sequelize, sequelize, user);
            this.singletonInstance = Waiter;
            console.log("Singleton Class_Wai Created!");
        } else {
            Waiter = sequelize.model("waiter");
            console.log("Only one Waiter Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new WaiterModel(Sequelize, sequelize, user);
    console.log("Waiter : " + f);
    // console.log(f.getUserTable())
}

function save(waiter) {
    Waiter.create(waiter)
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getWaiter() {
    return Waiter;
}

module.exports = {
   run, WaiterModel, getWaiter, save
}