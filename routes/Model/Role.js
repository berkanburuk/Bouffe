var Role;

class RoleModel {
    createRole(Sequelize, sequelize, role) {
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
    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Role = this.createRole(Sequelize, sequelize, user);
            this.singletonInstance = Role;
            console.log("Singleton Class_Rol Created!");
        } else {
            Role = sequelize.model("role");
            console.log("Only one Role Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, user) {
    var f = new RoleModel(Sequelize, sequelize, user);
    console.log("Role : " + f);
    // console.log(f.getUserTable())
}

function m() {
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

function getRole() {
    return Role;
}

module.exports = {
    run, RoleModel, getRole,
}