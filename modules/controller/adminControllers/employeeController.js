const ControllerModels = require("../ControllerModels");
const generator = require('generate-password');
const bcryptUtils = require("../../middlewares/bcryptUtils");

module.exports = new class EmployeeController extends ControllerModels{

 //passport js
    addNewEmployee = async (req, res) => {
        // this.Employee
        const randPassword = generator.generate({
            length : 6,
            numbers : true
        });
        //must hash password

        //roleId can not be an id that doesn't exists in roles table
        try{ 
            //services is an array =>services : [ {id : }, { id : } ]
            const { nationalId, roleId, fName, lName, phone, services } = req.body;
            console.log(randPassword)
            bcryptUtils.hashPassword( randPassword ).then( async hashedPass =>  {

                try{
                    const createdPerson = await this.Person.create( { fName, lName, password: hashedPass ,phone}, { raw : true} ); 
                    const createdEmployee = await this.Employee.create( {roleId, nationalId}, { raw : true} );
                    createdPerson.setEmployee( createdEmployee );
                    console.log("berfor")
                    if(services.length>0)
                    {
                        const foundServices = await this.findServices( services );
                        await createdEmployee.addServices( foundServices );
                    }
        
                    //add found services to created employee 
                    console.log("here")
                    
                    //after sending data get all employees by second request
                    console.log("here1")
                    const newPerson = createdPerson.toJSON();
                    const newEmpoloyee = createdEmployee.toJSON();
                    console.log("arrived")
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

}