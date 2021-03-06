const Sequelize = require('sequelize');


let deviceList = require('../Model/DeviceList');
let food = require('../Model/Food');
let menu = require('../Model/Menu');
let order = require('../Model/Order');
let role = require('../Model/Role');
let user = require('../Model/User');
let table = require('../Model/Table');
let beverage = require('../Model/Beverage');

let course = require('../Model/Course');
let payment = require('../Model/Payment');
let reservation = require('../Model/Reservation');
let guestCheck = require('../Model/GuestCheck');
let orderFood = require('../Model/OrderFood')

const tableNames = {
    user:"user",
    role:"role",
    order:"order",
    menu:"menu",
    food:"food",
    deviceList:"deviceList",
    table:"table",
    beverage:"beverage",
    payment:'payment',
    menuFood:"menuFood",
    course:'course',
    orderBeverage:'orderBeverage',
    orderFood:'orderFood',
    userCourse:'userCourse',
    orderMenu:'orderMenu',
    waiter : 'waiter',
    reservation:'reservation',
    guestCheck:'guestCheck',
    userRoles:'userRole',
    orderTable:'orderTable'
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
    //operatorsAliases: false,
    operatorsAliases: Sequelize.Op,
    pool: dbConnection.pool
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');


        })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


//1.
let roleModel = role.run(Sequelize,sequelize,tableNames.role);
//2.
let userModel =  user.run(Sequelize,sequelize,tableNames.user);
//3.
course.run(Sequelize,sequelize,tableNames.course);
//5.
table.run(Sequelize,sequelize,tableNames.table);

//7.
payment.run(Sequelize,sequelize,tableNames.payment);

//orderFood.run(Sequelize,sequelize,tableNames.orderFood);

//11.
order.run(Sequelize,sequelize,tableNames.order);

food.run(Sequelize,sequelize,tableNames.food);

menu.run(Sequelize,sequelize,tableNames.menu);

beverage.run(Sequelize,sequelize,tableNames.beverage);


reservation.run(Sequelize,sequelize,tableNames.reservation);

guestCheck.run(Sequelize,sequelize,tableNames.guestCheck);





sequelize.sync(
    //{force:true}
).then(()=>{
    role.createSimpleRoleData();
        course.createCourseData();
        user.createDefaultUser();

})


/*
module.exports = {
    getDBNames
    //Sequelize,sequelize,
}
*/


//console.log("MENUUU->" + sequelize.model("menu"));



//14
/*
*
    HasOne inserts the association key in target model
    whereas BelongsTo inserts the association key in the source model.
 *
 * Project.hasMany(User, {as: 'Workers'})
 * This will add the attribute projectId or project_id to User.
 * Instances of Project will get the accessors getWorkers and setWorkers.
* */
function getSequelize(){
    return sequelize;
}
function getTableNames(){
    return tableNames
}
function getUserModel(){
    return userModel;
}
function getSequelizeClass(){
    return Sequelize;
}
module.exports = {
    getSequelize,getTableNames,getUserModel,getSequelizeClass
}

/*
Users.findAll().then(user => {
    console.log(user)
})
*/



