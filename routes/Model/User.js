var UserTable;

class UserModel {
    createUser(Sequelize, sequelize, user) {
        //Creates the Content of Form
        UserTable = sequelize.define(user, {
            username: {
                primaryKey: true,
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            firstName: {
                type: Sequelize.STRING,
                //allowNull:false
            },
            lastName: {
                type: Sequelize.STRING,
                //allowNull:false
            },
            section: {
                type: Sequelize.INTEGER
            },
            registrationSemester: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
        UserTable.sync({
            //force:true
        }).then(() => {
            console.log("User table is created!");
        });
        return UserTable;
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            UserTable = this.createUser(Sequelize, sequelize, user);
            this.singletonInstance = UserTable;
            console.log("Singleton Class Created!");
        } else {
            UserTable = sequelize.model("user");
            console.log("Only one Food Class can be created!");
        }
    }

}

function run(Sequelize, sequelize, user) {
    var f = new User(Sequelize, sequelize, user);
    console.log("User : " + f);
    console.log(f.getUserTable())

}

function getByName(_name) {
    UserTable.findOne({
        name: _name
    })
        .then(user => {
            console.log('Found user: ${user}');
        })
}

function getUsers() {
    UserTable.findAll().then(function (food) {
        console.log(food[0].get('name'));
    });
}

function save(user, data) {
    user.create(data);
}


module.exports = {
    run, UserModel, save, getUsers, getByName
}
