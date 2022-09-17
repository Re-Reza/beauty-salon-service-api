const sequelizeInstacent = require(setPath.configPath+"/database");
const { DataTypes } = require("sequelize");

const Service = sequelizeInstacent.define("services", {
    serviceTitle : {
        type : DataTypes.STRING, //equals to VARCHAR(255)
        allowNull : false
    }

}, {
    freezeTableName : true, 
    timestamps : false
});

module.exports = Service;