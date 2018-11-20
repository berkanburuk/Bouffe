var Role;

class Role{
    createRole(Sequelize,sequelize,role) {
        Role = sequelize.define(role, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            }, /*
        userName:{
            type:Sequelize.STRING,
            allowNull:false
        }*/
        });
        Role.sync({
            //force:true
        })
            .then(() => {
                console.log("Role Table is created!");
            });
    }
}

function m (){
Role.findAll({
    attributes: ['image', 'desc', 'price', 'stock'],
    include: [{
        model: models.Type,
        attributes: [['name', 'Type']]
    }, {
        model: models.Specs,
        attributes: [['name', 'Specs']]
    }, {
        model: models.JctProductColors,
        include: [{
            model: models.Color,
            attributes: [['name', 'Color']]
        }]
    }
    ],
    where: {
        id: id
    }
});
}

function getAllRoles() {
    Role.findAll().then(function (roles) {
        console.log(roles[0].get('id'));
    });
}
function getRole(){
    return Role;
}

module.exports = {
    getRole,Role
}