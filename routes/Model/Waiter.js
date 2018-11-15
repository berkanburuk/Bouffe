var Waiter;

function createWaiter(Sequelize, sequelize, waiter) {
    Waiter = sequelize.define(waiter, {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        assignedTables: {
            type: Sequelize.INTEGER
        }
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