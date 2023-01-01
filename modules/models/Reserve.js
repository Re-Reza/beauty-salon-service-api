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
        type : DataTypes.STRING(150),
        allowNull : true
    },

    deleteTime : {
        type : DataTypes.STRING(80),
    },
    payment :{ 
        type : DataTypes.DECIMAL(15, 3),
        allowNull : true
    }
    // read : {
    //     type : DataTypes.BOOLEAN,
    //     defaultValue : false
    // }

} , {
    freezeTableName : true,
    paranoid : true,
    timestamps : false
});

module.exports = Reserve;

