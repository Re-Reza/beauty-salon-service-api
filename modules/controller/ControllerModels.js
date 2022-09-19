const Person = require(setPath.modelsPath+"/Person");
const Employee = require(setPath.modelsPath+"/Employee");
const ServiceCategory = require(setPath.modelsPath+"/ServiceCategoey");
const Service = require(setPath.modelsPath+"/Service");
const Reserve = require(setPath.modelsPath+"/Reserve");
const EmployeeService = require(setPath.modelsPath+"/EmployeeService");
const CustomerQuantitiy = require(setPath.modelsPath+"/CustomerQuantitiy");

module.exports = class ControllerModels {

    constructor() {
        this.Person = Person;
        this.Employee = Employee;
        this.ServiceCategory = ServiceCategory;
        this.Service = Service;
        this.Reserve = Reserve;
        this.EmployeeService = EmployeeService;
        this.CustomerQuantitiy = CustomerQuantitiy;
    }

}