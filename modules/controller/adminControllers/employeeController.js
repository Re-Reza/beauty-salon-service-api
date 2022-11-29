const ControllerModels = require("../ControllerModels");
const generator = require('generate-password');
const bcryptUtils = require("../../middlewares/bcryptUtils");
const { fn, col } = require("sequelize");

module.exports = new class EmployeeController extends ControllerModels{

 //passport js
    addNewEmployee = async (req, res) => {
        const randPassword = generator.generate({
            length : 6,
            numbers : true
        });

        //roleId can not be an id that doesn't exists in roles table
        try{ 
            const { nationalId, roleId, fName, lName, phone, services } = req.body;
            // console.log(randPassword)
            
            bcryptUtils.hashPassword( "1234" ).then( async hashedPass =>  {

                try{
                    //insert in
                    const createdPerson = await this.Person.create( { fName, lName, password: hashedPass ,phone}, { raw : true} ); 
                    const createdEmployee = await this.Employee.create( {roleId:1, nationalId}, { raw : true} );
                    createdPerson.setEmployee( createdEmployee );
                 
                    if(services.length>0)
                    {
                        const foundServices = await this.findServices( services );
                        await createdEmployee.addServices( foundServices );
                    }
        
                    //add found services to created employee 
                             
                    //after sending data get all employees by second request
                    const newPerson = createdPerson.toJSON();
                    const newEmpoloyee = createdEmployee.toJSON();
            
                    res.status(200).json({
                        success : true,
                        result : {
                            fName : newPerson.fName,
                            lName : newPerson.lName,
                            phone : newPerson.phone,
                            password : randPassword, //show pasword to client 
                            nationalId : newEmpoloyee.nationalId,
                            roleId : newEmpoloyee.roleId,
                            id : newEmpoloyee.id,
                        },
                    });
                }
                catch( err) {
                    console.log(err);
                    res.status(500).json({
                        success : false,
                        error : err,
                    })
                }

            });
        }
        catch( err ){
            res.status(422).json({
                success : false,
                error : err,
            })
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
                })
            });
        });
    } 

    provideFullInfoOfEmployees = async ( req, res ) => {
        try{
            const employees = await this.Employee.findAll({ attributes : ["id", "nationalId", "roleId"],
            include : [{ model : this.Person, attributes: ["id", "fName", "lName", "phone" ]} ,{model : this.Service}, 
            { model : this.Reserve} ]});
        
            const employeeList = [];

            employees.forEach( item => {
                employeeList.push( item.toJSON() );
            });

            console.log(employeeList);
            
            res.status(200).json({
                success : true, 
                result : employeeList
            });
        }  

        catch( err ) { 

            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });

        }
    } 

}