const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require('sequelize');
// const bcrypt = require("bycrypt");

const Role = sequelizeInstace.define("roles", {

    id : {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roleTitle: {
        type : DataTypes.STRING,
        allowNull : false 
    }

}, {
    freezeTableName: true,
});

module.exports = Role;