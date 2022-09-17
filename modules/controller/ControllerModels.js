const Person = require(setPath.modelsPath+"/Person");
const Employee = require(setPath.modelsPath+"/Employee");
const ServiceCategory = require(setPath.modelsPath+"/ServiceCategoey");
const Service = require(setPath.modelsPath+"/Service");

module.exports = class ControllerModels {

    constructor() {
        this.Person = Person;
        this.Employee = Employee;
        this.ServiceCategory = ServiceCategory;
        this.Service = ServiceCategory;
    }

}