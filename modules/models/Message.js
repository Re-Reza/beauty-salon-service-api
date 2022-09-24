const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require("sequelize");

const Message = sequelizeInstace.define("messages", {
    title : {
        type : DataTypes.STRING,
    },
    text : {
        type : DataTypes.TEXT, 
        allowNull : false 
    },
    createdTime : {
        type : DataTypes.STRING(25),
        allowNull : false
    },
    fromAdmin : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    messageType : {
        type : DataTypes.TINYINT,
        allowNull : false, 
        defaultValue : 1   //type 1 : message only belongsto user, type 2 : message belongsto all employees, type 3 : message belongsto all users ( employees included) 
    },
    idRead: {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    }
    
}, {
    freezeTableName : true, 
    timestamps : false 
});

module.exports = Message;
