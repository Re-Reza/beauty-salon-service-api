const { DataTypes } = require("sequelize");

const EmployeeService = require("./EmployeeService");
const Person = require("./Person");
const Employee = require("./Employee");
const Role = require("./Role");
const Reserve = require("./Reserve");
const ServiceCategory = require("./ServiceCategoey");
const Service = require("./Service");
const CustomerQuantitiy = require("./CustomerQuantitiy");
const Message = require("./Message");

module.exports = function () {
    
    Person.hasOne(Employee, { 
        foreignKey : {
            name : "personId",
            type : DataTypes.INTEGER,
            alllowNull : false
        },
        onDelete : "CASCADE"
    } );

    Employee.belongsTo( Person );

    Role.hasMany( Employee,{
        foreignKey : {
            name : "roleId",
            type : DataTypes.INTEGER,
            allowNull : false
        }
    } );

    Employee.belongsTo(Role);

    ServiceCategory.hasMany( Service, {
        foreignKey : {
            name : "categoryId",
            type : DataTypes.INTEGER,
        },
        onDelete : "CASCADE",
    }); 

    // Service.belongsTo(ServiceCategory);

    Employee.belongsToMany( Service, {
        through :  EmployeeService
    });

    Service.belongsToMany( Employee, {
        through : EmployeeService 
    });

    // طوری طراحی شود که اگر مشتری چند خدمت داشت بتواند آنها در یک روز به مشخض مچ کند یعنی صبح برای منو و شب برای ناخن نره 
    Person.hasMany( Reserve, {
            foreignKey : {
            name : "customerId",
            type : DataTypes.INTEGER,
            allowNull : false
        }
    });

    Reserve.belongsTo( Person,{
        foreignKey : {
        name : "customerId",
        type : DataTypes.INTEGER,
        allowNull : false
    } });

    Reserve.belongsTo( Service );

    Reserve.belongsTo( Employee );

    Employee.hasMany( Reserve, {
        foreignKey : {
            name : "employeeId",
            type : DataTypes.INTEGER,
            allowNull : false
        }
    });

    Service.hasMany( Reserve, {
        foreignKey : {
            name : "serviceId",
            type : DataTypes.INTEGER,
            allowNull : false 
        }
    });

    Employee.hasMany( CustomerQuantitiy, {
        foreignKey : {
            name : "employeeId",
            type : DataTypes.INTEGER,
            allowNull : false
        }
    });

    Person.hasMany( Message, {
        foreignKey : {
            name : "personId",
            allowNull : true,
            type : DataTypes.INTEGER,
            defaultValue : null
        }
    });

}

//Person, Employee, Role, Reserve, ServiceCategory, Service, CustomerQuantitiy, Message