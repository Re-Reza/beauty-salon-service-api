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
        const { date, serviceId } = req.body

        try{
            //optimize this part!
            const employeesOfService = await this.Service.findAll({ where : { id: serviceId }, include : [ { model: this.Employee } ], raw : true })
            const validEmployees = [];

            employeesOfService.forEach( (item, index) => {
                this.isEmployeeValid( item['employees.id'], date, serviceId ).then( isValid => {
                    if( isValid ){

                        this.Person.findOne( { where : { id : item['employees.personId'] }, raw : true } ).then( person => {
                            validEmployees.push({
                                fName : person.fName,
                                lName : person.lName,
                                personId : person.id,
                                employeeId : item['employees.id'],
                                phone : person.phone
                            });
    
                            if( index === employeesOfService.length - 1 ) {
    
                                res.status(200).json({
                                    success : true,
                                    result : validEmployees
                                });
                            }
                            
                        }).catch(err => {
                            console.log(err)
                        })
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
                reserveDate : date, status : { [Op.or] : ["waiting",  "postponed"]}, serviceId : serviceId  } } );
            
            const isValid = counter < 2 ? true : false;
            return isValid;     
        }
        catch(err){
            console.log(err)
        }
    }

    addReserve = async ( req, res ) => {
        try{ 
            //تاریخ و کارمندان وخدمات در دسترس کاربر قبل از قرار گرفتن در دسترسی ان اعتبار سنجی شده اند
            const { reserveDate, customerId, employeeId, serviceId} = req.body;
            console.log(req.body);
            const m = moment();
            moment.locale('fa', { useGregorianParser: true } );
            const resrveResult = await this.Reserve.create( { reserveDate, status: "waiting", customerId, employeeId, serviceId } );
            //userId will add to  req by auth middleware
            //const { userId } = req.userId;
            const userId = 1;
            await this.Message.create( { title: "ثبت رزرو", text :  `رزرو شما با موفقیت برای تاریخ ${reserveDate}ثبت گردید`, createdTime: m.format("YYYY/MM/DD"), personId : userId  } );
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
        const { serviceId } = req.query;
        const employeesOfService = await this.Service.findAll({ where : { id : serviceId }, include : [ { model: this.Employee } ], raw : true });
        // console.log(employeesOfService)
        const employees = [];
        employeesOfService.forEach( (item, index) => {

            this.Person.findByPk(item['employees.personId'], { raw : true}).then( person => {
          
                employees.push({
                    fName : person.fName,
                    lName : person.lName,
                    phone : person.phone,
                    personId : person.id,
                    username : person.username,
                    employeeId : item['employees.id']
                });

                if( index == employeesOfService.length-1){
                    console.log(employees)
                    res.status(200).json({
                        success : true,
                        result : employees
                    });
                }
            });
        });
        
        //can include child table for result of parent, but cant include parent table in result of child
        // const e = await this.Person.findOne( { where : { id :10 }, include : { model : this.Employee } } );
        // console.log(e)

    }


    extractEmployeeTimeWork = async ( req, res ) => {
  
        const { employeeId, serviceId } = req.query;
        // res.json("this is a employee");

        const m = moment();
        moment.locale('fa', { useGregorianParser: true } );
        m.add(5, 'day');
        console.log(m.format("YYYY/M/D") );
        const {count, rows} = await this.Reserve.findAndCountAll( { where : {employeeId, serviceId }, raw: true });
        
        const weekFreeTimeWork = [];
        console.log( new Date().getMilliseconds() );
        for( let i=0; i<7; i++ ) {
            const result = this.countReserves( rows, m.format("YYYY/M/D") );
            m.add(1, "day");
            weekFreeTimeWork.push( result < 2 ? true : false );
        }
        console.log(weekFreeTimeWork);

        console.log(new Date().getMilliseconds() );

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
}