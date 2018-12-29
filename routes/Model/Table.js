var Table;

class TableModel {
    createTable(Sequelize, sequelize, table) {
        Table = sequelize.define(table, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            structure: {
                type: Sequelize.STRING,
                allowNull: false
            },
            capacity: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue:0
                //0 kırık
                //1 kullanıma uygun
                //2 order var
            },
            totalPrice: {
                type: Sequelize.DOUBLE,
                defaultValue:0.0
            },

            //Table Merge Daha Bitmedi
            mergedWith: {
                type: Sequelize.INTEGER,
                defaultValue: -2
                //-2 ise hiçbir table'a bağlı değil
                //-1 ise table'a bağlı
            }
        });
        //User - Table
        let mUser = sequelize.model('user');
        Table.belongsTo(mUser,{targetKey:'username',onDelete:'CASCADE'});

        let mPayment= sequelize.define('payment',{});
        Table.hasOne(mPayment,{onDelete:'CASCADE'});

        /*
        let mTable= sequelize.define('table',{});
        Table.belongsTo(mTable,{foreignKey:'mergedWith',targetKey:'id',onDelete:'CASCADE'});
        */
        //
        let mOrder= sequelize.define('order',{});
        let mOrderTable= sequelize.define('orderTable',{});
        Table.belongsToMany(mOrder,{through: mOrderTable,targetKey:'id', onDelete: 'CASCADE'});

        return Table;
    }

    constructor(Sequelize, sequelize, table) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Table = this. createTable(Sequelize, sequelize, table);
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
    return Table;
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
   run
}
