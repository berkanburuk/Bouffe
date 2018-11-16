var Role;

function createRole(Sequelize,sequelize,role) {
    Role = sequelize.define(role, {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },/*
        userName:{
            type:Sequelize.STRING,
            allowNull:false
        }*/
    });
    Role.sync({
        //force:true
    })
        .then(()=>{
            console.log("Role Table is created!");
        });

}

function getRole(){
    return Role;
}

module.exports = {
    createRole,getRole
}