const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes, STRING } = require('sequelize');

const Employee = sequelizeInstace.define("employees", {
    nationalId : {
        type : DataTypes.STRING,
        allowNull : false
    },
}, {
    freezeTableName : true
});

module.exports = Employee;
