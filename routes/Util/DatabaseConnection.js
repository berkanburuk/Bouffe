const Sequelize = require('sequelize');

let chair = require('../Model/Chair');
let chef = require('../Model/Chef');
let deviceList = require('../Model/DeviceList');
let food = require('../Model/Food');
let instructor = require('../Model/Instructor');
let menu = require('../Model/Menu');
let order = require('../Model/Order');
let role = require('../Model/Role');
let user = require('../Model/User');
let student = require('../Model/Student');
let waiter = require('../Model/Waiter');
let table = require('../Model/Table');
let beverage = require('../Model/Beverage');
let menuFood = require('../Model/MenuFood');

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
    instructor: "instructor",
    student: "student",
    waiter:"waiter",
    table:"table",
    beverage:"beverage",
    menuFood:"menuFood"
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


var Chair = chair.createChair(Sequelize,sequelize,tableNames.chair);
var DeviceList = deviceList.createDeviceList(Sequelize,sequelize,tableNames.deviceList);
var Food = food.createFood(Sequelize,sequelize,tableNames.food);
var Menu = menu.createMenu(Sequelize,sequelize,tableNames.menu);
var Role = role.createRole(Sequelize,sequelize,tableNames.role);


var User = user.createUser(Sequelize,sequelize,tableNames.user);
var Table = table.createTable(Sequelize,sequelize,tableNames.table);
var Beverage = beverage.createBeverage(Sequelize,sequelize,tableNames.beverage);


var Waiter = waiter.createWaiter(Sequelize,sequelize,tableNames.waiter);
var Student = student.createStudent(Sequelize, sequelize, tableNames.student);
var Instructor = instructor.createInstructor(Sequelize,sequelize,tableNames.instructor);
var Order = order.createOrder(Sequelize,sequelize,tableNames.order);
var MenuFood = menuFood.createMenuFood(Sequelize,sequelize,tableNames.menuFood);


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


