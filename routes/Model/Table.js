var Table;
var sequ = require('../Util/DatabaseConnection').getSeq;

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
    Table.create(table)
        .then(newUser => {
            console.log(newUser.name);
        });
}


function getUsers() {
    User.findAll().then(function (tables) {
        console.log(tables[0].get('name'));
    });
}

function getTableModel(){
    let s = sequ();
    let mTable = s.model("table");
    return mTable;
}
function save(data) {
    let mTable = getTableModel();
    mTable.create(data);
}

module.exports = {
    TableModel, save, getUsers,getTableModel
}
