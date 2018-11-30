var User;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

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
            },
            bilkentId: {
                type:Sequelize.INTEGER
            }
        });
        //let dbNames = tableNames();
        //UserRole
        let mRole= sequelize.model('role');
        let mUserRole= sequelize.model('userRole');
        User.belongsToMany(mRole,{through: mUserRole,targetKey:'username'});

        //UserCourse
        const mCourse = sequelize.define('course', {})
        const mUserCourse = sequelize.define('userCourse', {})
        User.belongsToMany(mCourse,{through: mUserCourse,targetKey:'username'});

/*
        User.sync({
            //force:true
        }).then(() => {
            console.log("User table is created!");
        });
        mUserRole.sync({
            //force:true
        }).then(() => {
            console.log("UserRole table is created!");
        });*/
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
    return User;
   // console.log(f.getUserTable())
}

function findByName() {
    Student.findOne({
        instructorId: 0
    })
        .then(user => {
            console.log('Found user: ${user}');
        })
}


function join(){
    Student.findAll({
        where:{
            id: 1
        },
        include: [{
            model: models.User,
            as: 'userFriend',
            through: {
                attributes: ['id', 'invitStatus'],
            },
            include: [{
                model: models.Message
            }],
        }]
    });
}
function getUser(){
    return User;
}

module.exports = {
    run,getUser
}
