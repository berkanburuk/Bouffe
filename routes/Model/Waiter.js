var Waiter;
var Role = require('./Role');
var User = require('./User');
function createWaiter(Sequelize, sequelize, waiter) {
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

        Waiter.belongsTo(User.getUser(),{
            onUpdate: 'cascade',
            keyType: Sequelize.STRING,
            foreignKey: 'username',
            targetKey: 'username'
        });


    Waiter.sync({
        //force:true
    }).then(() => {
        console.log("Waiter Table is created!")
    });
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
    createWaiter, getWaiter, save
}