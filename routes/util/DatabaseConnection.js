const Sequelize = require('sequelize');

const database = "bouffe";
const username = "postgres";
const password = "1q2w3e4r5t";
const hostName ="cemreberkdemirci.com";
const portNumber = "5432";

const sequelize = new Sequelize(database, username, password, {
    host: hostName,
    port:portNumber,
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 100
    },
});


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const PersonalInfos = sequelize.define("personalInfos", {
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },

    firstName: {
        type: Sequelize.STRING,
        allowNull:false
    },
    lastName: {
        type: Sequelize.STRING
    },
    section :{
        type: Sequelize.INTEGER
    },
    registration_semester:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});



const roles = sequelize.define("roles",{
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

roles.sync({force:true}).then(()=>{
   return roles.create({
       roleName:'admin'
   });
});

const Users = sequelize.define("users",{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    personalInfoId:{
        unique:true,
        type:Sequelize.INTEGER
    },
    roleId:{
        unique:true,
        type:Sequelize.INTEGER
    },

    username:{
        type:Sequelize.STRING,
        allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

Users.belongsTo(PersonalInfos, {foreignKey: 'fk_Personal',targetKey:'id'});
Users.belongsTo(roles,{foreignKey: 'fk_Role',targetKey: 'id'});


// force: true will drop the table if it already exists
PersonalInfos.sync({force: true}).then(() => {
    // Table created
    return PersonalInfos.create({
        firstName: 'Berkan',
        lastName: 'Buruk',
        section: 1
    });
});

Users.sync({
    force:true
}).then(()=>{
   return Users.create({
      username:'berkan',
      password:'1'
   });
});

Users.findAll().then(user => {
    console.log(user)
})


//module.exports = {sequelize,Sequelize};