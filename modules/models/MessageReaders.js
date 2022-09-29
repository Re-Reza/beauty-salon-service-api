const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require("sequelize");

//all readers of a message will be stored here
const MessageReaders = sequelizeInstace.define("messageReaders", {

    personId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    }

}, {
    timestamps : false,
    freezeTableName : true 
});

module.exports = MessageReaders;