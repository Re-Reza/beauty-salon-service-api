const ControllerModels = require('./ControllerModels');
const { Op, where } = require("sequelize");

module.exports = new class ReserveController extends ControllerModels {

    extractEmployeesOfDate = async ( req, res ) => {
        const { month, day } = req.body;
        const date = "1401/7/5";
        const serviceId = 16
        // this.Reserve.findAll( { where :  { reserveDate: date, serviceId  }, raw : true} ).then( result => console.log(result ) );
        // const foundEmployees = await this.EmployeeService.findAll( { where : { serviceId: serviceId}, include: this.Employee } );
        // console.log(foundEmployees)
        // console.log(foundEmployees[0].getEmployees())
        const test = await this.Service.findAll({ where : { id: serviceId }, include : { model: this.Employee }, raw : true })
        console.log(test);
    }

    addReserve = ( req, res ) => {
        //route working 
    }

}