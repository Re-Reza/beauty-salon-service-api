const { Sequelize } = require('sequelize');

const { DB_PASSWORD, DB_NAME, DB_USERNAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    dialect : "mysql",
    host : "localhost",
    port : "3306",
    // define: {
    // }
});

module.exports = sequelize;