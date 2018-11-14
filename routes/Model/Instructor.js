var Instructor;



function createInstructor(Sequelize,sequelize,instructor) {
    Instructor = sequelize.define(instructor,{
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        }
    })
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