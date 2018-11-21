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
let appointment= require('../Model/Appointment');
let bartender = require('../Model/Bartender');
let course = require('../Model/Course');
let orderBeverage = require('../Model/OrderBeverage');
let orderFood = require('../Model/OrderFood');

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
    menuFood:"menuFood",
    bartender:"bartender",
    course:'course',
    orderBeverage:'orderBeverage',
    orderFood:'orderFood'
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


//console.log("MENUUU->" + sequelize.model("menu"));


//1.

role.run(Sequelize,sequelize,tableNames.role);

//2.
user.run(Sequelize,sequelize,tableNames.user);
//3.
course.run(Sequelize,sequelize,tableNames.course);
//4.

student.run(Sequelize,sequelize,tableNames.student);
//5.

instructor.run(Sequelize,sequelize,tableNames.instructor,role);

//6.
chef.run(Sequelize,sequelize,tableNames.chef);

//7.malte de table -> not required now

//8.

//bartender.run(Sequelize,sequelize,tableNames.bartender);
//9.
//waiter.run(Sequelize,sequelize,tableNames.waiter);

//10.
menu.run(Sequelize,sequelize,tableNames.menu);
//11.

food.run(Sequelize,sequelize,tableNames.food);
//12.

menuFood.run(Sequelize,sequelize,tableNames.menuFood);

//13.
order.run(Sequelize,sequelize,tableNames.order);

//14.
beverage.run(Sequelize,sequelize,tableNames.beverage);
//15.

orderBeverage.run(Sequelize,sequelize,tableNames.orderBeverage);

//16.
orderFood.run(Sequelize,sequelize,tableNames.orderFood);



function getSeq(){
    return sequelize;
}

module.exports = {
    getSeq
}

/*
Users.findAll().then(user => {
    console.log(user)
})
*/



