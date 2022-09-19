const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes, STRING } = require('sequelize');

const CustomerQuantitiy = sequelizeInstace.define("customerQuantities", {
    sat : {
        type : DataTypes.TINYINT,
        defaultValue : 4
    },
    sun : {
        type : DataTypes.TINYINT,
        defaultValue : 4
    },
    mon : {
        type : DataTypes.TINYINT,
        defaultValue : 4
    },    
    tues : {
        type : DataTypes.TINYINT,
        defaultValue : 4
    },   
    wed : {
        type : DataTypes.TINYINT,
        defaultValue : 4
    },
    thurs: {
        type : DataTypes.TINYINT,
        defaultValue : 4
    },
    friday: {
        type : DataTypes.TINYINT,
        defaultValue : 4 
    },
    deletedDate : {
        type : DataTypes.STRING(25),
        defaultValue : null
    }
    
},{
    freezeTableName : true,
    timestamps : false
});

module.exports = CustomerQuantitiy;