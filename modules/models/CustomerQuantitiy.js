const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require('sequelize');

const CustomerQuantitiy = sequelizeInstace.define("customerQuantities", {
    d0 : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    d1 : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    d2 : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },    
    d3 : {
        type : DataTypes.INTEGER,
        defaultValue : 4
    },   
    d4 : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    d5: {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    d6: {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    isFirstWeek :{
        type : DataTypes.BOOLEAN,
        defaultValue : true
    },
    // deletedDate : {
    //     type : DataTypes.STRING(25),
    //     defaultValue : null
    // }
    
},{
    freezeTableName : true,
    timestamps : false
});

module.exports = CustomerQuantitiy;