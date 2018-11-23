const Sequelize = require('sequelize');

let chair = require('../Model/Chair');
let deviceList = require('../Model/DeviceList');
let food = require('../Model/Food');
let menu = require('../Model/Menu');
let order = require('../Model/Order');
let role = require('../Model/Role');
let user = require('../Model/User');
let table = require('../Model/Table');
let beverage = require('../Model/Beverage');
let menuFood = require('../Model/MenuFood');
let appointment= require('../Model/Appointment');
let course = require('../Model/Course');
let orderBeverage = require('../Model/OrderBeverage');
let userCourse = require('../Model/UserCourse');
let payment = require('../Model/Payment');
let OrderMenu = require('../Model/OrderMenu');

const tableNames = {
    user:"user",
    role:"role",
    order:"order",
    menu:"menu",
    food:"food",
    chair:"chair",
    deviceList:"deviceList",
    table:"table",
    beverage:"beverage",
    payment:'payment',
    menuFood:"menuFood",
    course:'course',
    orderBeverage:'orderBeverage',
    orderFood:'orderFood',
    userCourse:'userCourse',
    orderMenu:'orderMenu'
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
userCourse.run(Sequelize,sequelize,tableNames.userCourse);

//5.
table.run(Sequelize,sequelize,tableNames.table);
//6.
chair.run(Sequelize,sequelize,tableNames.chair);

//7.
menu.run(Sequelize,sequelize,tableNames.menu);
//8.

food.run(Sequelize,sequelize,tableNames.food);

//9.
menuFood.run(Sequelize,sequelize,tableNames.menuFood);
//10.
payment.run(Sequelize,sequelize,tableNames.payment);
//11.
beverage.run(Sequelize,sequelize,tableNames.beverage);

//12
order.run(Sequelize,sequelize,tableNames.order);

//13
orderBeverage.run(Sequelize,sequelize,tableNames.orderBeverage);

//14
OrderMenu.run(Sequelize,sequelize,tableNames.orderMenu);

function getSequelize(){
    return sequelize;
}
function getTableNames(){
    return tableNames
}
module.exports = {
    getSequelize,getTableNames
}

/*
Users.findAll().then(user => {
    console.log(user)
})
*/



