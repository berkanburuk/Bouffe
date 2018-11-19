var Student;
var Role = require('./Role');
var User = require('./User');

function createStudent(Sequelize, sequelize, student) {

    Student = sequelize.define(student, {
        bilkentId: {
            type: Sequelize.INTEGER
        },
        instructorId:{
            type: Sequelize.INTEGER
        },
        instructorId2:{
            type: Sequelize.INTEGER
        },
        section: {
            type: Sequelize.STRING,
            allowNull: false
        },
        starsFilePath: {
            type: Sequelize.STRING,
            allowNull: false
        }

    });
    Student.belongsTo(Role.getRole());
    /*
    Student.belongsTo(User.getUser(),{
        //onUpdate: 'cascade',
        keyType: Sequelize.STRING,
        foreignKey: 'username',
        targetKey: 'username'
    });
    */
    Student.sync({
        //force: true
    })
        .then(() => {
            console.log("Student Table is created!");
            getAllStudents2();
        });

}


function getStudent() {
    return Student;
}

function getAllStudents() {
    Student.findAll({

    });
}

function getAllStudents2() {
    /*
    console.log("Student -> " +Student);
        Student.findAll().then(function (username) {
            console.log(username[0].get('username'));
        });
        */
}

function getStudentwww() {
    var a = Student.findAll({
        where: {
            instructorId: 0
        }
    })    .then(firstName => {
        console.log('Found user: ${firstName}');
    })

}

function findByName() {
    Student.findOne({
        instructorId: 0
    })
        .then(user => {
            console.log('Found user: ${user}');
        })
}

function save(student) {

    Student.create(student)
        .then(newUser => {
            console.log(newUser.name);
        });
}

function join(){
    models.User.findAll({
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

module.exports = {
    createStudent, getStudent, findByName, save, getAllStudents,getAllStudents2,Student
}
