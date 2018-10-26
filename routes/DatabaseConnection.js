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


module.exports = {sequelize,Sequelize};