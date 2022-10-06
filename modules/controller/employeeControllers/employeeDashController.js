const ControllerModels = require("../ControllerModels");
const { Op } = require("sequelize");

module.exports = new class EmployeeDashController extends ControllerModels {

    provideEmployeeInfo = async ( req, res ) => {

        try{
            const { tokenPersonId, tokenEmployeeId } = req;
            const employee = await this.Person.findByPk(tokenPersonId ,{ attributes : ['id', 'fName', 'profileImg','lName', 'phone', 'employee.nationalId', 'employee.roleId'], raw : true, include : {model : this.Employee, include : {model: this.Role}} });
            const services = await this.Employee.findAll({ where : { id : tokenEmployeeId}, include: [ { model : this.Service } ],raw :true })

            let employeeServices;
            if(services[0]['services.id'] == null)
                employeeServices = []
            else{
                employeeServices = services.map( item => {
                    return {
                        serviceId : item['services.id'],
                        serviceTitle : item['services.serviceTitle'],
                        serviceCategoryId : item['services.categoryId'] 
                    }
                });
            }

            res.status(200).json({
                success : true,
                result : {
                    id : employee.id,
                    employeeId : employee['employee.id'],
                    fName : employee.fName,
                    profileImg : employee.profileImg,
                    lName : employee.lName,
                    phone : employee.phone,
                    nationalId : employee.nationalId,
                    roleId : employee.roleId,
                    roleTitle : employee['employee.role.roleTitle'],
                    services : employeeServices
                }
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });
        }
    } 

    extractCustomerList = async ( req, res ) => {

        try { 
            let employeeId;
            if(req.query.employeeId)
                employeeId = req.query.employeeId
            else
                employeeId = req.query.tokenEmployeeId; 
                                            
            //  status  : { [Op.or] : ['waiting', 'finilized'] }  
            const transformedData = await this.extractCustomerReservesList( employeeId, [0, 1] );
            console.log(transformedData);
            res.status(200).json({
                success : true,
                result : transformedData,
                start : new Date().setDate( new Date().getDate() ),
                end : new Date().setDate( new Date().getDate()+6 )
            });
        }
        catch( err ){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }

    extractCustomerReservesList = async (tokenEmployeeId, readValues ) => {
        try{
            //read : { [Op.or] : [...readValues] } was wrriten for messages
            const reserves = await this.Reserve.findAll({ where: { employeeId : tokenEmployeeId, deleteTime : null }, raw : true, include : [{ model : this.Service}, {model : this.Person}] });
            // console.log(reserves)
            const transformedData = reserves.map( item => {
                return {
                    id : item.id,
                    reserveDate : item.reserveDate,
                    status : item.status,
                    serviceTitle : item['service.serviceTitle'],
                    serviceId : item['service.id'],
                    customerId : item['person.id'],
                    customerName : item['person.fName'],
                    customerLastname : item['person.lName'],
                    customerPhone : item['person.phone'],
                    reserveTime : item.reserveTime
                }
            });
            return transformedData;
        }
        catch(err){
            if(err) 
                throw err;
        }
    }

    //should Employee setTime
    editDateAndTime = async ( req, res ) => {
        try{
            // const { tokenEmployeeId, params : { reserveId } } = req;
            // const tokenEmployeeId = req.tokenEmployeeId || req.query;
            const {reserveId} = req.params;
            const statusCondition = req.tokenRoleID == 2 ? ["waiting", "finalized"] : ["waiting"];
            // const newData = {}
            // if( req.body.time )
            //     newData.reserveTime = req.body.time;
            // if( req.body.date )
            //     newData.reserveDate = req.body.date;

            const newData = req.body.newTime;
            const result = await this.Reserve.update({ reserveTime : newData, status : "finalized" }, { where  : { id : reserveId,  status: { [Op.or] : [...statusCondition] } } })
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : newData
                });
            }

            
            return res.status(422).json({
                success : false,
                error : ".ویرایش اعمال نشد"
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }

    finalizeReserve = async ( req, res ) => {
        
        try{
            const { reserveId } = req.params;
            const result = await this.Reserve.update( {status : "finalized"}, { where : { id : reserveId } });
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : "تاریخ و ساعت رزرو تایید شد و به مشتری اطلاع داده می شود"
                });
            }

            res.status(422).json({
                success : false,
                error : "خطایی رخ داده است"
            });
            //در  اعلاعانات داشپورد هم پیام نمایش داده شود ارسال پیام به مشتری و اطلاع رسانی آن
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }

    //reserves that belongs to employee its self
    extractReserves = async ( req, res ) => { 
        try{ 
            // const { tokenPersonId } = req;
            const { employeeId } = req.params;
            const reserves = await this.Reserve.findAll({ where : { customerId : employeeId }, raw : true, include : [{model : this.Employee, include : {model : this.Person}}, { model : this.Service}, { model : this.Person}] });
            console.log(reserves)
            const reservesData = reserves.map( item => {
                return {
                    id: item.id,
                    reserveDate  : item.reserveDate,
                    status : item.status,
                    employeefName : item["employee.person.fName"],
                    employeelName : item["employee.person.lName"],
                    employeeId : item["employee.person.id"],
                    service : item["service.serviceTitle"],
                    reserveTime : item.reserveTime,
                    customerId : item['person.id'],
                    customerFname : item['person.fName'],
                    customerLname : item['person.lName'],
                    customerPhone : item['person.phone']
                }
            } );

            res.status(200).json({
                success : true,
                result : reservesData
            });
        }
        catch( err ){
            res.status(500).json({
                success : false,
                error : err
            });
        }
    }

    generateMessages = async ( req, res ) => {
        // try{
        //     const { tokenEmployeeId } = req;
        //     const reserves = await this.Reserve.findAll({ where : { employeeId : tokenEmployeeId, read : 0 }, raw : true, include : [ { model : this.Person}, { model : this.Service} ] });
        //     const messages = reserves.map( item => {
        //         // return ` ${item['person.fName'] } ${item.reserveDate} کاربر   برای تاریخ  و خدمت ${item["service.serviceTitle"]} نوبت رزرو کرده است.`
        //         return ".نوبت رزرو کرده است"+item['service.serviceTitle']+" و خدمت "+item.reserveDate+" برای تایخ "+item['person.lName']+" "+item['person.fName']+" کاربر";
        //     });
        //     console.log(reserves);
        //     console.log(messages);
        //     res.status( 200 ).json({
        //         success : true,
        //         result :messages
        //     });
        // }
        // catch( err ){

        // }

        try{ 
            //message of admin must sent from this api too!!
            const data = this.extractCustomerReservesList()
        }
        catch( err ){
            res.status(500).json({
                success : false,
                error : err
            });
        }
    }
}