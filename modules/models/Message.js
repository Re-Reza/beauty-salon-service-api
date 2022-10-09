const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes, ENUM } = require("sequelize");

const Message = sequelizeInstace.define("messages", {
    title : {
        type : DataTypes.STRING,
    },
    text : {
        type : DataTypes.TEXT, 
        allowNull : false 
    },
    createdTime : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    messageType : { //type 1 just for employees, type 2 just for customer, type 3 for all users of site
        type : DataTypes.ENUM("1", "2", "3"),
        allowNull : false, 
    },
    // deleteTime : {
    //     type : DataTypes.STRING(50),
    //     defaultValue : null
    // }
    // idRead: {
    //     type : DataTypes.BOOLEAN,
    //     defaultValue : false
    // }
    
}, {
    freezeTableName : true, 
    timestamps : false 
});

module.exports = Message;
