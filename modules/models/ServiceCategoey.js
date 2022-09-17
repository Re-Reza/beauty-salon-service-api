const sequelizeInstacent = require(setPath.configPath+"/database");
const { DataTypes } = require("sequelize");

const ServiceCategory = sequelizeInstacent.define("serviceCategories", {
    categoryTitle : {
        type : DataTypes.TEXT('tiny')
    }
}, {
    freezeTableName : true,
    timestamps : false
});

module.exports = ServiceCategory;