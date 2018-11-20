var Table;

class User {
    createTable(Sequelize, sequelize, table) {
        Table = sequelize.define(table, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            structure: {
                type: Sequelize.STRING,
                allowNull: false
            },
            capacity: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER
            },
            mergedWith: {
                type: Sequelize.INTEGER
            }
        });
        //PersonalInfo.belongsTo(Users, {foreignKey: 'fk_Personal',targetKey:'personalInfoId'});
        Table.sync({
            //force: true
        }).then(() => {
            console.log("Table table has created!");
        })

    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Table = this.createUser(Sequelize, sequelize, user);
            this.singletonInstance = UserTable;
            console.log("Singleton Class Created!");
        } else {
            Table = sequelize.model("user");
            console.log("Only one Table Class can be created!");
        }
    }
}

function save(table) {
    PersonalInfo.create(table)
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getTable() {
    return Table;
}

module.exports = {
    Table, getTable, save
}
