const sequelizeInstacent = require(setPath.configPath+"/database");
const { DataTypes } = require("sequelize");

const Service = sequelizeInstacent.define("services", {
    serviceTitle : {
        type : DataTypes.STRING, //equals to VARCHAR(255)
        allowNull : false
    },
    cost:  { 
        type : DataTypes.DECIMAL(15, 3),
        allowNull : true
    }

}, {
    freezeTableName : true, 
    timestamps : false
});

module.exports = Service;