var User;
var sequ = require('../Util/DatabaseConnection').getSeq;

class UserModel {
    createUser(Sequelize, sequelize, user) {
        //Creates the Content of Form
        User = sequelize.define(user, {
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
            registrationSemester: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
        User.sync({
            //force:true
        }).then(() => {
            console.log("User table is created!");
        });
        return User;
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            User = this.createUser(Sequelize, sequelize, user);
            this.singletonInstance = User;
            console.log("Singleton Class Created!");
        } else {
            User = sequelize.model("user");
            console.log("Only one Food Class can be created!");
        }
    }

}

function run(Sequelize, sequelize, user) {
    var f = new UserModel(Sequelize, sequelize, user);
    console.log("User : " + f);
   // console.log(f.getUserTable())
}

function getByName(_name) {
    User.findOne({
        name: _name
    })
        .then(user => {
            console.log('Found user: ${user}');
        })
}

function getUsers() {
    User.findAll().then(function (users) {
        console.log(users[0].get('name'));
    });
}


function save(data) {
    //let user = getUserModel();
    user.create(data);
}

function getUserModel(){
    let s = sequ();
    let mUser = s.model("user");
    return mUser;
}
function getUser(){
    return User;
}

module.exports = {
    run, UserModel, save, getUsers, getByName,getUserModel,getUser
}
