const  { Op, fn, col, where } = require("sequelize");

const moment = require("jalali-moment");

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

    changeReserveStatus = async (req, res) => {
        try {
            const { params : {reserveId }, body: { status } } = req;
            const result = await this.Reserve.update( { status }, { where : { id : reserveId } });
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : "تغییرات با موفقیت اعمال شد"
                });
            }

            res.status(422).json({
                success : false,
                error : "اعمال تغییرات با خطا مواجه شد"
            });
            
        } catch (error) {
            res.status(500).json({
                error : err,
                success : false
            });
        }

    }

    deleteReserve = async (req, res) => {
        try {
            moment.locale("fa", { useGregorianParser : true });
            const currentTime = moment().format("YYYY/MM/DD HH:mm:ss");
            console.log(currentTime);
            const result = await this.Reserve.update({deleteTime: currentTime}, { where :  {id : req.params.reserveId } });
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : "با موفقیت حذف شد"
                });
            }
            console.log(result);
            res.status(422).json({
                success : false,
                error : "خطایی رخ داده است"
            });
        
        } catch (error) {
            res.status(500).json({
                error,
                success : false
            });
        }
    }
    
    searchInReservesByDate = async (req, res) => {
        try {

            const { reserveDate } = req.query;
            const employeeId = req.query.employeeId || req.tokenEmployeeId;
            console.log(employeeId);
            console.log(reserveDate);            
            const condition = {
                reserveDate, 
            };
            if( employeeId )
            {
                condition.employeeId = employeeId;
            }
            console.log(condition);
            const secarchResult = await this.Reserve.findAll({ where : { ...condition, status : { [Op.or] : ["cancelled", "done"] } }, raw : true});
            console.log(secarchResult);
            res.status(200).json({
                success : true,
                result : secarchResult
            });

        } catch (err) {
            res.status(500).json({
                success : false,
                error : err
            });            
        }
    }

    extractReservesByStatus = async (req, res) => {
        
        try {
            const { reserveStatus } = req.query;
            // console.log(JSON.parse(reserveStatus) );
            const reserves = await this.Reserve.findAll({ where : { status : { [Op.or] : JSON.parse(reserveStatus) }, deleteTime : null }, 
            raw : true, include : [{ model: this.Person }, { model: this.Employee, include : { model : this.Person } }, { model: this.Service }] });
            const transformedData = reserves.map( item => {
                return {
                    id : item.id,
                    reserveDate : item.reserveDate,
                    reserveTime : item.reserveTime,
                    employeeId : item['employee.id'],
                    employeeFname : item['employee.person.fName'],
                    employeeLname : item['employee.person.lName'],
                    emplloyePhone : item['employee.person.phone'],
                    status : item.status,
                    serviceTitle : item['service.serviceTitle'],
                    serviceId : item['service.id'],
                    customerId : item['person.id'],
                    customerName : item['person.fName'],
                    customerLastname : item['person.lName'],
                    customerUsername : item['person.username'],
                    customerPhone : item['person.phone']
                }
            });
            res.status(200).json({
                success : true,
                result : transformedData
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error,
                success : false
            });
        }
    }

    searchReservesByNameOrPhone = async (req, res) => {
        //if enetered phone search on phone and entered name search on name   
        try{
            const { isEmployee, searchValue } = req.query;
            console.log(isEmployee, searchValue);
            let searchResult;
            if( isEmployee == 1 ) {
                searchResult = await this.Employee.findAll({  
                    include : [ {model : this.Person, where : {
                        [Op.or] : [ 
                            {
                                phone : { [Op.like] : `${searchValue}%` } 
                            },
                            where(fn('concat', col('fName'),' ', col('lName')), {
                                [Op.like]: `${searchValue}%`
                            })
                        ]} }], raw:true 
                });
            }
            else{ 
                //optimize this part by sequelize options ?!
                const allUsers = await this.Person.findAll({ 
                    where : { [Op.or] : [
                        {
                            phone : { [Op.like] : `${searchValue}%` } 
                        },
                        where(fn('concat', col('fName'),' ', col('lName')), {
                            [Op.like]: `${searchValue}%`
                        })
                    ]}  
                    , raw :true, include : [{model : this.Employee, required: false,require : false}]
                });
                searchResult = allUsers.filter( user => user['employee.id'] == null )
            }
            console.log(searchResult);

            res.status(200).json({
                success : true,
                result : "testing"
            });
        }   
        catch( err ){
            console.log(err);
            res.status(500).json({
                success : false,
                error : err
            });
        }
    }
}