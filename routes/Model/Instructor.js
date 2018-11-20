var Instructor;
var Role = require('./Role');
var User = require('./User');

class InstructorModel{
    createInstructor(Sequelize,sequelize,instructor) {
        Instructor = sequelize.define(instructor,{
            userName: {
                type: Sequelize.STRING
            }
        })
        Instructor.belongsTo(Role.getRole());
        /*
        Instructor.belongsTo(User.getUser(),{
            onUpdate: 'cascade',
            keyType: Sequelize.STRING,
            foreignKey: 'username',
            targetKey: 'username'
        });
        */

        Instructor.sync({
            //force:true
        }).then(()=>{
            console.log("Instructor Table is created!")
        });
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Instructor = this.createInstructor(Sequelize, sequelize, user);
            this.singletonInstance = Instructor;
            console.log("Singleton Class_Ins Created!");
        } else {
            Instructor = sequelize.model("instructor");
            console.log("Only one Instructor Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new InstructorModel(Sequelize, sequelize, user);
    console.log("Instructor : " + f);
    // console.log(f.getUserTable())
}

function getAllInstructors() {
    Instructor.findAll().then(function (instructor) {
        console.log(instructor[0].get('userName'));
    });
}
function save(instructor){
    //Instructor.create(instructor);
    Instructor.create({
        name: instructor.name,
        roleId:instructor.roleId,
    })
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getInstructor(){
    return Instructor;
}

module.exports = {
    run,InstructorModel, getAllInstructors, getInstructor,save
}