var Instructor;
var Role = require('./Role');
var User = require('./User');

function createInstructor(Sequelize,sequelize,instructor) {
    Instructor = sequelize.define(instructor,{
        userName: {
            type: Sequelize.STRING
        }
    })
    Instructor.belongsTo(Role.getRole());
    Instructor.belongsTo(User.getUser(),{
        onUpdate: 'cascade',
        keyType: Sequelize.STRING,
        foreignKey: 'username',
        targetKey: 'username'
    });

    Instructor.sync({
        //force:true
    }).then(()=>{
        console.log("Instructor Table is created!")
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
    createInstructor,getInstructor,save
}