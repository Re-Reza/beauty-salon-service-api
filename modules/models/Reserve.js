const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require('sequelize');

const Reserve = sequelizeInstace.define("reserves", { 
    reserveDate : {
        type : DataTypes.STRING(25),
        allowNull : false
    },

    status : {
        type : DataTypes.ENUM("done", "cancelled", "finalized", "waiting"),
        allowNull : false
    },

    reserveTime : {
        type : DataTypes.STRING(25),
        allowNull : true
    },

    deleteTime : {
        type : DataTypes.STRING(25),
    }

} , {
    freezeTableName : true,
    paranoid : true,
    timestamps : false
});

module.exports = Reserve;

