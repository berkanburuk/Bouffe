const Sequelize = require('sequelize');

var chair = require('../Model/Chair');
var chef = require('../Model/Chef');
var deviceList = require('../Model/DeviceList');
var food = require('../Model/Food');
var instructor = require('../Model/Instructor');
var menu = require('../Model/Menu');
var order = require('../Model/Order');
var personalInfo = require('../Model/PersonalInfo');
var role = require('../Model/Role');
var user = require('../Model/User');


    const tableNames = {
        user:"user",
        role:"role",
        personalInfo:"personalInfo",
        order:"order",
        menu:"menu",
        food:"food",
        chef:"chef",
        chair:"chair",
        deviceList:"deviceList",
        instructor:"instructor"
    }


const dbConnection = {
    database : 'bouffe',
    username : 'postgres',
    password : "1q2w3e4r5t",
    hostName : "cemreberkdemirci.com",
    portNumber : "5432",
    pool :{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 100
    }
}
const sequelize = new Sequelize(dbConnection.database, dbConnection.username, dbConnection.password, {
    host: dbConnection.hostName,
    port:dbConnection.portNumber,
    dialect: 'postgres',
    operatorsAliases: false,
    pool: dbConnection.pool
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


/*
module.exports = {
    getDBNames
    //Sequelize,sequelize,
}
*/


chair.createChair(Sequelize,sequelize,tableNames.chair);
deviceList.createDeviceList(Sequelize,sequelize,tableNames.deviceList);
food.createFood(Sequelize,sequelize,tableNames.food);
instructor.createInstructor(Sequelize,sequelize,tableNames.instructor);
menu.createMenu(Sequelize,sequelize,tableNames.menu);
order.createOrder(Sequelize,sequelize,tableNames.order);
personalInfo.createPersonalInfo(Sequelize,sequelize,tableNames.personalInfo);
role.createRole(Sequelize,sequelize,tableNames.role);
user.createUser(Sequelize,sequelize,tableNames.user);
console.log( "order = " + order.getOrder());

var m = {
    name:"Kebap",
    cousinRegion: "buruk",
    foodId:1
};
menu.save(m);

module.exports = {
    tbNames: tableNames
};

/*
Users.findAll().then(user => {
    console.log(user)
})
*/

