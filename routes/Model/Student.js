var Student;

function createStudent(Sequelize, sequelize, student) {

    Student = sequelize.define(student, {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        bilkentId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        section: {
            type: Sequelize.STRING,
            allowNull: false
        },
        starsFileId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

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
