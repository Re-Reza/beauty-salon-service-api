const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require('sequelize');

const Reserve = sequelizeInstace.define("reserves", { 
    date : {
        type : DataTypes.STRING(20),
        allowNull : false
    },

    status : {
        type : DataTypes.ENUM("done", "cancelled", "postponed", "waiting"),
        allowNull : false
    },


} , {
    freezeTableName : true,
    paranoid : true
});

module.exports = Reserve;

