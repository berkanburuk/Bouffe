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
    Student.belongsTo(User.getUser(),{
        onUpdate: 'cascade',
        keyType: Sequelize.STRING,
        foreignKey: 'username',
        targetKey: 'username'
    });
    Student.sync({
        //force: true
    })
        .then(() => {
            console.log("Student Table is created!");
        });
}


function getStudent() {
    return Student;
}

function getAllStudents() {
    Student.findAll({
        //attributes: ['foo', 'bar']
    });
}

function getStudentsByColumns() {
    //Daha sonra bak
    Student.findAll({
        //attributes: ['foo', 'bar']
    });
}

function findByName() {
    Student.findOne({
        name: 'deneme'
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


module.exports = {
    createStudent, getStudent, findByName, save, getAllStudents
}
