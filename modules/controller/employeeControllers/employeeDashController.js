const ControllerModels = require("../ControllerModels");
const { Op } = require("sequelize");

module.exports = new class EmployeeDashController extends ControllerModels {

    provideEmployeeInfo = async ( req, res ) => {

        try{
            const { tokenPersonId } = req;
            const employee = await this.Person.findByPk(tokenPersonId ,{ attributes : ['id', 'fName', 'lName', 'username', 'phone', 'employee.nationalId', 'employee.roleId'], raw : true, include : {model : this.Employee, include : {model: this.Role}} });

            res.status(200).json({
                success : true,
                result : {
                    id : employee.id,
                    employeeId : employee['employee.id'],
                    fName : employee.fName,
                    lName : employee.lName,
                    username : employee.username,
                    phone : employee.phone,
                    nationalId : employee.nationalId,
                    roleId : employee.roleId,
                    roleTitle : employee['employee.role.roleTitle']
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
            const { tokenEmployeeId } = req;                                                   
            //  status  : { [Op.or] : ['waiting', 'finilized'] }  
            const reserves = await this.Reserve.findAll({ where: { employeeId : tokenEmployeeId, deleteTime : null}, raw : true, include : [{ model : this.Service}, {model : this.Person}] });
            const transformedData = reserves.map( item => {
                return {
                    id : item.id,
                    reserveDate : item.reserveDate,
                    status : item.status,
                    serviceTitle : item['service.serviceTitle'],
                    customerId : item['person.id'],
                    customerName : item['person.fName'],
                    customerLastname : item['person.lName'],
                    customerUsername : item['person.username'],
                    customerPhone : item['person.phone']
                }
            });
            console.log(transformedData);
            res.status(200).json({
                success : true,
                result : transformedData
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

    //should Employee setTime
    editDateAndTime = async ( req, res ) => {
        try{
            const { tokenEmployeeId, params : { reserveId } } = req;

            const newData = {}
            if( req.body.time )
                newData.reserveTime = req.body.time;
            if( req.body.date )
                newData.reserveDate = req.body.date;
    
            const result = await this.Reserve.update({ ...newData }, { where  : { id : reserveId,  status: "waiting" } })
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : ".باموفقیت ویرایش اعمال شد"
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

}