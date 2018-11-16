var Table;

function createTable(Sequelize, sequelize, table) {
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
    createTable, getTable, save
}