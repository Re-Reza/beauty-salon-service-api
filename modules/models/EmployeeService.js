const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require('sequelize');

const EmployeeService = sequelizeInstace.define("employeeService", {
    
    id : {
        type: DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    employeeId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },

    serviceId : {
        type : DataTypes.INTEGER,
        allowNull : false
    }

},{
    timestamps : false,
    freezeTableName : true 
})

module.exports = EmployeeService;