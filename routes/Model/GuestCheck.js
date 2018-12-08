let GuestCheck;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

class RoleModel {
    createGuestCheck(Sequelize, sequelize, guestCheck) {
        GuestCheck = sequelize.define(guestCheck, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            }
        });
    }
    constructor(Sequelize, sequelize, guestCheck) {
            GuestCheck = this.createGuestCheck(Sequelize, sequelize, guestCheck);
            console.log("Guest Check Created!");
        }
}

function run(Sequelize, sequelize, guestCheck) {
    var f = new RoleModel(Sequelize, sequelize, guestCheck);
    console.log("Guest Check Constructor: " + f);
}

module.exports = {
    run
}
