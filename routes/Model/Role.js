let Role;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

class RoleModel {
    createRole(Sequelize, sequelize, role) {
        Role = sequelize.define(role, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            roleName : {
                type:Sequelize.STRING,
                allowNull:false
            }
        });
        const User = sequelize.define('user', {})
        const UserRole = sequelize.define('userRole', {})

        Role.belongsToMany(User,{
            through:UserRole,
            //otherKey: 'username'
            });
        /*
        Role.sync({
            //force:true
        })
            .then(() => {
                console.log("Role Table is created!");
            });
            */
        return Role;
    }
    constructor(Sequelize, sequelize, role) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Role = this.createRole(Sequelize, sequelize, role);
            this.singletonInstance = Role;
            console.log("Singleton Class_Rol Created!");
        } else {
            Role = sequelize.model("role");
            console.log("Only one Role Class can be created!");
        }
    }
}

function createSimpleRoleData(){

    Role.create({
            id:1,
            roleName:'admin'
        }).catch(err=>{

    });


    Role.create({
        id:2,
        roleName:'cashier'
    }).catch(err=>{
    });

        Role.create({
        id:3,
        roleName:'chef'
        }).catch(err=>{

        });
        Role.create({
        id:4,
        roleName:'matre'
        }).catch(err=>{

        });
    Role.create({
        id:5,
        roleName:'waiter'
    }).catch(err=>{

    });
    Role.create({
        id:6,
        roleName:'bartender'
    }).catch(err=>{

    });

}

function run(Sequelize, sequelize, role) {
    var f = new RoleModel(Sequelize, sequelize, role);
    console.log("Role Cons: " + f);
    return Role;
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


module.exports = {
    run, createSimpleRoleData
}