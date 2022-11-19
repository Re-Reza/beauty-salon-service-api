const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require("sequelize");

const Product = sequelizeInstace.define("products", { 

    ProductTitle : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    price : {
        type : DataTypes.DECIMAL(24, 4),
        allowNull : true,
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : true,
    },
    imgs : {
        //seperate address of each image by useing || symbol
        type : DataTypes.TEXT("medium"),
        allowNull : true
    },
    creationTime : {
        type : DataTypes.STRING(180),
        allowNull : false
    }


}, {
    freezeTableName : true,
    timestamps : false
}); 

module.exports = Product;