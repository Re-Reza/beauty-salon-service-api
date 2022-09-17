const sequelizeInstace = require(setPath.configPath+"/database");
const { DataTypes } = require('sequelize');
// const bcrypt = require("bycrypt");

const Person = sequelizeInstace.define("persons", {
    fName : {
        type : DataTypes.STRING,
        allowNull : true,

    },
    lName : {
        type : DataTypes.STRING,
        allowNull : true,
        
    }, 
    username : {
        type : DataTypes.STRING,
        allowNull : false ,  
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false 
    },
    phone : {

        type : DataTypes.STRING(18),
        unique : {
            msg : "با این شماره موبایل قبلا ثبت نام شده"
        },
        // unique : true
            
    },
    //define profile in database?

}, {
    freezeTableName: true,
    // paranoid : true,  //beacause of being paranoid customzied message did not work for validation
});

module.exports = Person;