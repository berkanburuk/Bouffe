let Role;
var sequ = require('../Util/DatabaseConnection').getSeq;

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
        Role.sync({
            //force:true
        })
            .then(() => {
                console.log("Role Table is created!");
            });
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
        });
        Role.create({
        id:2,
        roleName:'student'
        });
        Role.create({
        id:3,
        roleName:'chef'
        });
        Role.create({
        id:4,
        roleName:'matre'
        });
    Role.create({
        id:5,
        roleName:'waiter'
    });
    Role.create({
        id:6,
        roleName:'bartender'
    });

}

function run(Sequelize, sequelize, role) {
    var f = new RoleModel(Sequelize, sequelize, role);
    console.log("Role Cons: " + f);
    createSimpleRoleData();
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

function getRoles() {
    Role.findAll().then(function (roles) {
        console.log(roles[0].get('id'));
    });
}
function getRoleModel(){
    console.log(sequ());
    let s = sequ();
    console.log("s " +  s);
    let mRole = s.model("role");
    return mRole;
}
function getRole(){
    console.log("INSIDE ROLEEE -> " + Role);
    return Role;
}


function save(data) {
    let mRole = getRoleModel();
    mRole.create(data)
        .then(newUser => {
            console.log(newUser.id);
        });
}


module.exports = {
    run, RoleModel,getRoleModel,getRole
}