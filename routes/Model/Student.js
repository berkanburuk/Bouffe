var Student;
var Role = require('./Role');
var User = require('./User');
var sequ = require('../Util/DatabaseConnection').getSeq;

class StudentModel{
    createStudent(Sequelize, sequelize, student) {

        Student = sequelize.define(student, {
            bilkentId: {
                type: Sequelize.INTEGER
            },
            username:{
                type:Sequelize.STRING,
                references: {
                    model: 'users', // name of Target model
                    key: 'username' // key in Target model that we're referencing
                }
            },
            roleId:{
                type:Sequelize.INTEGER,
                references: {
                    model: 'roles', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                    onDelete :'cascade',
                    onUpdate :'cascade'
                }
            },
            courseId:{
                type:Sequelize.INTEGER,
                references: {
                    model: 'courses', // name of Target model
                    key: 'id' // key in Target model that we're referencing
                }
            },
            currentRoleId: {
                type: Sequelize.INTEGER,
                default: 0
                //Waiter
            },
            isApproved:{
                type:Sequelize.BOOLEAN
            }

        });
        //Student.belongsTo(Role.getRoleModel());
/*
        Student.belongsTo(Role.getRole(),{
            onUpdate: 'cascade',
            onDelete: 'cascade',
            keyType: Sequelize.INTEGER,
            foreignKey: 'fk_Role',
            targetKey: 'id'
        });
*/
        Student.sync({
            //force: true
        })
            .then(() => {
                console.log("Student Table is created!");
                getAllStudents();
            });
        return Student;
    }

    constructor(Sequelize, sequelize, student) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Student = this.createStudent(Sequelize, sequelize, student);
            this.singletonInstance = Student;
            console.log("Singleton Class_Stu Created!");
        } else {
            Student = sequelize.model("student");
            console.log("Only one Student Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, student) {
    var f = new StudentModel(Sequelize, sequelize, student);
    console.log("Student : " + f);
    // console.log(f.getUserTable())
}

function getAllStudents() {
    /*
    let us = "There is not a student!";
    console.log("Student getAllStudents -> " + Student);
        Student.findAll().then(function (username) {
            console.log(username[0].get('username'));
            us = username;
        });
    return us;
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

function getStudentModel(){
    let s = sequ();
    let mStudent = s.model("student");
    return mStudent;
}

function save(data) {
    let mStudent = getStudentModel();
    mStudent.create(data)
        .then(newUser => {
            console.log(newUser.username);
        });
}
function getStudent(){
    return Student;
}

module.exports = {
    run, StudentModel, findByName, save,getAllStudents,Student,getStudentModel,getStudent
}
