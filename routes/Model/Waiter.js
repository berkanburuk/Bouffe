var Waiter;
var sequ = require('../Util/DatabaseConnection').getSeq;
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
            currentRoleId:{
                type: Sequelize.INTEGER
            },
            assignedTables: {
                type: Sequelize.INTEGER
            }
        });
                Waiter.belongsTo(Student.getStudent(),{
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    keyType: Sequelize.STRING,
                    foreignKey: 'fk_WaiterRoleName',
                    targetKey: 'username'
                });
        Waiter.sync({
            //force:true
        }).then(() => {
            console.log("Waiter Table is created!")
        });

        return Waiter;
    }
    constructor(Sequelize, sequelize, waiter) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Waiter = this.createWaiter(Sequelize, sequelize, waiter);
            this.singletonInstance = Waiter;
            console.log("Singleton Class_Wai Created!" + Waiter);
        } else {
            Waiter = sequelize.model("waiter");
            console.log("Only one Waiter Class can be created!");
        }
    }

}

function run(Sequelize, sequelize, waiter) {
    var f = new WaiterModel(Sequelize, sequelize, waiter);
    console.log("Waiter : " + f);
    // console.log(f.getUserTable())
}

function getWaiters() {
    Waiter.findAll().then(function (waiters) {
        console.log(waiters[0].get('name'));
    });
}


function save(data) {
    let mWaiter = getWaiterModel();
    mWaiter.create(data)
        .then(newUser => {
            //console.log(newUser.username);
        });
}

function getWaiterModel(){
    let s = sequ();
    let mWaiter = s.model("waiter");
    return mWaiter;
}



module.exports = {
   run, save,getWaiters,getWaiterModel
}