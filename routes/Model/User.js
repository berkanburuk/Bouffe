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
        User.belongsToMany(mRole,{through: mUserRole,targetKey:'username', onDelete: 'CASCADE'});

        //UserCourse
        const mCourse = sequelize.define('course', {})
        const mUserCourse = sequelize.define('userCourse', {})
        User.belongsToMany(mCourse,{through: mUserCourse,targetKey:'username', onDelete: 'CASCADE'});

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
/*
const createDefaultUser = (data)=> {
    var data = {
        username: 'berkan',
        password: '1234',
        firstName: 'berkan',
        lastName: 'buruk',
        registrationSemester: '01.01.1994',
        bilkentId: '1234'
    };
    return new Promise((resolve, reject) => {
        User.findOrCreate({
            where:{
                username:data.username
            }
        })
            .then((user) => {
                console.log(user[0].get(0));
                user[0].setRoles(1);
            })
            .catch(error=>{
                reject(error);
        })
    })

}
*/
function sampleUserData(){
    var data = {
        username: 'berkan',
        password: '1234',
        firstName: 'berkan',
        lastName: 'buruk',
        registrationSemester: '01.01.1994',
        bilkentId: 1234
    }
    return data;

}

const createDefaultUser = (data,roleId,courseId)=> {
      data = sampleUserData();
        roleId = 1;
        courseId = 246;

    return new Promise((resolve, reject) => {
            User.findOrCreate({
            where:
                {
                    username: data.username
                },
            defaults:
                {
                    password: '1234',
                    firstName: 'berkan',
                    lastName: 'buruk',
                    bilkentId: 1
                }
        }).then((user)=>{
            console.log(user[0].get(0));
            user[0].setRoles(roleId);
                user[0].setCourses(courseId);
                resolve("User is created successfully.");
        })
                /*.spread((user, created)=> {
                    console.log("CRRRR : " + created);
                    console.log(user.get({plain: true}));

                })*/
        .catch(error =>{
            reject("User Createtion" + error);
        })

    })

}


const addRoleToUser = (data) =>{
    return new Promise((resolve,reject)=>{
        User.findByPk(data)
            .then((user)=>{
                user.setRoles('1');
                resolve(user);
            }).catch(error=>{
            reject(error);
        })
    })
}
module.exports = {
    run,createDefaultUser
}
