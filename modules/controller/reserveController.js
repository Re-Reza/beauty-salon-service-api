const ControllerModels = require('./ControllerModels');
const { Op } = require("sequelize");
const moment = require('jalali-moment');

module.exports = new class ReserveController extends ControllerModels {

    provideCategories = async ( req, res) => {
        try{
            const cagtegories = await this.ServiceCategory.findAll({ raw: true });
            res.status(200).json({
                result: cagtegories,
                success: true
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                error: err,
                success: false
            });
        }
    }

    provideServicesOfCategory = async ( req, res) => {
        try{
            const { categoryId } = req.params;
            const services = await this.Service.findAll({ where : { categoryId }, raw:true });
            res.status(200).json({
                result: services,
                success: true
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                error: err,
                success: false
            });
        }
    }

    extractEmployeesOfDate = async ( req, res ) => {
        // const { month, day } = req.body;
        console.log(req.query)
        const { date, serviceId } = req.query

        try{
            //optimize this part!
            const employeesOfService = await this.Service.findAll({ where : { id: serviceId }, include : [ { model: this.Employee, include : { model:this.Person}  } ], raw : true })
            
            const validEmployees = [];
            console.log(employeesOfService)
            employeesOfService.forEach( (item, index) => {
                this.isEmployeeValid( item['employees.id'], date, serviceId ).then( isValid => {
                    if( isValid ){

                        validEmployees.push({
                            fName : item['employees.person.fName'],
                            lName : item['employees.person.lName'],
                            personId : item['employees.person.id'],
                            employeeId : item['employees.id'],
                            phone : item['employees.person.phone'],
                            roleId : item['employees.roleId'],
                            profileImg : item['employees.person.profileImg']
                        });

                        if( index === employeesOfService.length - 1 ) {
                            res.status(200).json({
                                    success : true,
                                    result : validEmployees
                            });
                        }
                    }
                });
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

    isEmployeeValid = async ( id, date, serviceId ) => {
        try{ 
            const counter = await this.Reserve.count( { where : { employeeId : id,
                reserveDate : date, status : { [Op.or] : ["waiting",  "finalized"]}, serviceId : serviceId  } } );
            
            //must get number of week customer from propre table
            return counter < 2 ? true : false;
        }
        catch(err){
            console.log(err)
        }
    }

    //زمان تایید رزرو یک بار دیگر اطلاعاتی ارسالی برسی شود که مثلا کارمد فضای خالی در ان روز دارد یا نه
    addReserve = async ( req, res ) => {
        try{ 
            //تاریخ و کارمندان وخدمات در دسترس کاربر قبل از قرار گرفتن در دسترسی ان اعتبار سنجی شده اند
            const customerId = req.tokenPersonId;
            const { reserveDate, employeeId, employeePersonId, serviceId} = req.body;
            if(customerId == employeePersonId )
                return res.status(422).json({
                    sucess : false,
                    error : "مشتری و کارمند نمیتوانند یکسان باشند"
                })
                console.log("in top")
            console.log(req.body);
            const m = moment();
            moment.locale('fa', { useGregorianParser: true } );
            const resrveResult = await this.Reserve.create( { reserveDate, status: "waiting", customerId, employeeId, serviceId } );
            // await this.Message.create( { title: "ثبت رزرو", text :  `رزرو شما با موفقیت برای تاریخ ${reserveDate}ثبت گردید`, createdTime: m.format("YYYY/MM/DD"), personId : userId  } );
            res.status(200).json({
                success : true,
                result : resrveResult
            });
        }
        catch(err){
            console.log(err)
            res.status(500).json({
                error: err,
                success: false
            });
        }

    }

    extractEmployeesOfService = async ( req, res ) => {
        try{
            const { serviceId } = req.query;
            const employeesOfService = await this.Service.findAll({ attributes:[] ,where : { id : serviceId }, 
                include : [ { model: this.Employee, attributes:['id', 'roleId'], 
                include :{model:  this.Person,  attributes:['id', 'fName', 'lName', 'phone', 'profileImg']} } ], raw : true });
            
            let transformedData = employeesOfService.map( item => ({
                employeeId : item['employees.id'],
                personId: item['employees.person.id'],
                phone : item['employees.person.phone'],
                fName : item['employees.person.fName'],
                lName : item['employees.person.lName'],
                profileImg : item['employees.person.profileImg'],
                roleId : item['employees.roleId']
            }) );
            if(transformedData.length == 1 && transformedData[0].fName == null)
                transformedData = [];
            // console.log(transformedData);
            res.status(200).json({
                success : true,
                result : transformedData
            })
        }
        catch(err) {
            console.log(err)
            res.status(500).json({
                error : err,
                success : false
            });
        }

        //can include child table for result of parent, but cant include parent table in result of child
        // const e = await this.Person.findOne( { where : { id :10 }, include : { model : this.Employee } } );
        // console.log(e)
    }


    extractEmployeeTimeWork = async ( req, res ) => {
  
        const { employeeId, serviceId } = req.query;
        const m = moment();
        moment.locale('fa', { useGregorianParser: true } );
        console.log(m.format("YYYY/M/D") );

        const {count, rows} = await this.Reserve.findAndCountAll( { where : {employeeId, serviceId }, raw: true });

        const weekFreeTimeWork = [];
        for( let i=0; i<7; i++ ) {
            const result = this.countReserves( rows, m.format("YYYY/M/D") );
            console.log(result);
            if(result < 2){ //get number from related table
                weekFreeTimeWork.push( m.format("DD") );
            }
            m.add(1, "day");
        }

        res.status(200).json({
            result : {
                freeDays : weekFreeTimeWork,
                start : new Date().setDate( new Date().getDate() ),
                end : new Date().setDate( new Date().getDate()+6)
            },
            success : true
        });

    } 

    countReserves = ( reserves , date ) => {
        let counter = 0; 
    
        reserves.forEach( reserve => {
    
            if(reserve.reserveDate == date ) { 
                counter++;
            }
        });

        return counter;
    }

    provideDateRange = (req, res) => {
        res.status(200).json({
                result : {
                start : new Date().setDate( new Date().getDate() ),
                end : new Date().setDate( new Date().getDate()+6)
            },
            success : true
        });
    }
}