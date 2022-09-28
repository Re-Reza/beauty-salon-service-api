const  { Op } = require("sequelize");

const ControllerModels = require("../ControllerModels");

module.exports = new class Admin extends ControllerModels {

    employeesList = async (req, res) => {
        const employees = await this.Employee.findAll({ where : { roleId : { [Op.not] : [2] } }, 
            include : [ {model : this.Person}, {model: this.Role} ] });
    
        const transformedData = [];
        employees.forEach( async (item, index) => {
            const employeeServices = await item.getServices();
            const employeeData = item.toJSON();
     
            transformedData.push({
                employeeId : employeeData.id,
                perosnId : employeeData.personId,
                nationalId : employeeData.nationalId,
                fName : employeeData.person.fName,
                lName : employeeData.person.lName,
                phone : employeeData.person.phone,
                profileImg : employeeData.person.profileImg,
                role: employeeData.role,
                services : employeeServices.map( service => {
                    return service.toJSON();
                })
            });
            if( index == employees.length-1){
                console.log(transformedData);
                res.status(200).json({
                    result : transformedData,
                    success : true
                });
            }
        } );

    }

    // extractEmployeeServeces = async ( req, res) => {
    //     try{    
    //         const { employeeId } = req.params;
    //         const result = await this.Employee.findAll({ where: {id : employeeId}, include : [ { model : this.Service}], raw : true  });
    //         const transformedData = result.map( item => ({
    //             serviceId : item['services.id'],
    //             serviceTitle : item['services.serviceTitle'],
    //             serviceCategoryId : item['services.categoryId']
    //         }) );

    //         res.status(200).json({
    //             result : transformedData,
    //             success : true
    //         });
    //     }   
    //     catch(err) {
    //         console.log(err);
    //         res.status(500).json({
    //             error : err,
    //             success : false
    //         });
    //     }
    // }

    extractServices = async ( req, res) => {
        try{
            const services  = await this.Service.findAll({ raw: true });
            console.log(services)
            res.status(200).json({
                result : services,
                success : true
            });
        }
        catch(err){
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }

    extractRoles = async ( req, res) => {
        //extract all roles except admin ( to avoid giving another person role admin)
        try {
            const roles = await this.Role.findAll({ where : { id : {[Op.not] : [2] } }, raw: true });
            res.status(200).json({
                result : roles,
                success : true
            });
        } catch (error) {
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }

    editEmployeeInfo = async ( req, res) => {
        try{
            const{ personId, employeeId } = req.params;
            // console.log(req.body);
            //all of varible must have value if they are not suppoesed to change must have default valu
            const { fName, lName, phone, nationalId, newServices, roleId } = req.body;

            const foundPerson = await this.Person.findOne( { where : { id : personId } });
            foundPerson.phone = phone;
            foundPerson.fName = fName;
            foundPerson.lName = lName;
            await foundPerson.save();
           
            const employee = await foundPerson.getEmployee();
            employee.nationalId = nationalId;
            employee.roleId = roleId;
            await employee.save();
           
            const foundServices = await this.findServices( newServices );
            employee.setServices( foundServices );
        }
        catch(err){
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }
    
    findServices = ( services ) => {
        return new Promise(( resolve ) => {
            let foundServices = [];
            services.forEach( item =>  {
                this.Service.findByPk( item.id ).then( result =>{
                    foundServices.push( result );
                    if( foundServices.length == services.length )
                        resolve( foundServices );
                });
            });
        });
    } 

    
}