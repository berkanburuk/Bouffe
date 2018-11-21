var sequ = require('../Util/DatabaseConnection').getSeq;
var Role = require('./Role');
var User = require('./User');
var Instructor;


class InstructorModel{
    createInstructor(Sequelize,sequelize,instructor) {
        Instructor = sequelize.define(instructor,{
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            username:{
                type:Sequelize.STRING,
                references: {
                    model: 'users', // name of Target model
                    key: 'username' // key in Target model that we're referencing
                }
            }, roleId:{
                type:Sequelize.INTEGER,
                references: {
                    model: 'roles', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                    onDelete :'cascade',
                    onUpdate :'cascade'
                }
            },
        })

        console.log("Instructor -> " + User.getUser());
        /*
        Instructor.belongsTo(User.getUser(),{
            onDelete: 'cascade',
            onUpdate:'cascade',
            keyType: Sequelize.STRING,
            foreignKey: 'username',
            targetKey: 'username'
        });

        console.log("Role -> " + Role.getRole());

        Instructor.belongsTo(Role.getRole(),{
            onDelete: 'cascade',
            onUpdate:'cascade',
            keyType:Sequelize.INTEGER,
            foreignKey: 'fk_Role',
            targetKey:'id'
        });
*/

        Instructor.sync({
            //force:true
        }).then(()=>{
            console.log("Instructor Table is created!")
        });
        return Instructor;
    }

    constructor(Sequelize, sequelize, instructor) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Instructor = this.createInstructor(Sequelize, sequelize, instructor);
            this.singletonInstance = Instructor;
            console.log("Singleton Class_Ins Created!");
        } else {
            Instructor = sequelize.model("instructor");
            console.log("Only one Instructor Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, instructor) {
    var f = new InstructorModel(Sequelize, sequelize, instructor);
    console.log("Instructor : " + f);
    // console.log(f.getUserTable())
}

function getInstructors() {
    Instructor.findAll().then(function (instructor) {
        console.log(instructor[0].get('userName'));
    });
}

function save(data) {
    let mInstructor = getInstructorModel();
    mInstructor.create(data)
        .then(newUser => {
            console.log(newUser.username);
        });
}


function getInstructorModel(){
    let s = sequ();
    let mInstructor = s.model("instructor");
    return mInstructor;
}

function getInstructor(){
    return Instructor;
}

module.exports = {
    run,InstructorModel, getInstructors, getInstructorModel,save,getInstructor
}