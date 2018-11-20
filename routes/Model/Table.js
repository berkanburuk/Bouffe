var Table;

class TableModel {
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
            Table = this. createTable(Sequelize, sequelize, user);
            this.singletonInstance = Table;
            console.log("Singleton Class_Tab Created!");
        } else {
            Table = sequelize.model("table");
            console.log("Only one Table Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new TableModel(Sequelize, sequelize, user);
    console.log("Table : " + f);
    // console.log(f.getUserTable())
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
    TableModel, getTable, save
}
