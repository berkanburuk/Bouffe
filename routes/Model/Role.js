var Role;

function createRole(Sequelize,sequelize,role) {
    const Role = sequelize.define(role,{
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        roleName:{
            type:Sequelize.STRING,
            allowNull:false
        }

    });

    //Role.belongsTo(Users,{foreignKey: 'fk_Role',targetKey: 'roleId'});


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