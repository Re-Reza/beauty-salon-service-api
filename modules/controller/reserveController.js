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

        console.log(req.query)
        const { date, serviceId } = req.query

        try{
            const employeesOfService = await this.Service.findAll({ where : { id: serviceId }, include : [ { model: this.Employee, include : { model:this.Person}  } ], raw : true })
            
            moment.locale("fa", { useGregorianParser : true });
            const m = moment();
            console.log(date)
            const selectedDate =  moment(date, "YYYY/MM/DD");
            const currentWeek = m.jWeek();
            let isFirstWeek;
            if(selectedDate.jWeek() == currentWeek)
                isFirstWeek = 1;
            else 
                isFirstWeek = 0;
            const dayNumber = selectedDate.jDay();
            console.log("----")
            console.log(isFirstWeek);

            const validEmployees = [];
            employeesOfService.forEach( (item, index) => {
                this.isEmployeeValid( item['employees.id'], date, serviceId, isFirstWeek, dayNumber ).then( isValid => {
                    console.log(isValid)
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
                    }
                    if( index === employeesOfService.length - 1 ) {
                        res.status(200).json({
                            success : true,
                            result : validEmployees
                        });
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

    isEmployeeValid = async ( id, date, serviceId, isFirstWeek, dayNumber ) => {
        try{    

            const quantity = await this.CustomerQuantitiy.findOne({ where : { employeeId : id, isFirstWeek }, raw : true});
            console.log(quantity); 

            const quty = quantity ? quantity[`d${dayNumber}`] : 0;
            // console.log("quty: "+quty);
            const counter = await this.Reserve.count( { where : { employeeId : id,
                reserveDate : date, status : { [Op.or] : ["waiting",  "finalized"]}, serviceId : serviceId  } } );

            return counter < quty ? true : false;
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
        // const m = moment().add(2,"day");
        moment.locale('fa', { useGregorianParser: true } );
        const m = moment();
        const currentDayOfWeek = m.jDay();
        
        const {count, rows} = await this.Reserve.findAndCountAll( { where : {employeeId, serviceId, status :{ [Op.or] : ['waiting', 'finalized']} }, raw: true });
        const weekFreeTimeWork = [];
        console.log(rows)
        console.log(m.format("YYYY/MM/DD"));
        if( currentDayOfWeek >= 4)
        {   
            const quantities = await this.CustomerQuantitiy.findAll({ where : { employeeId:employeeId }, 
                attributes : ['d0','d1','d2','d3','d4','d5', 'd6', 'isFirstWeek'], raw : true });
    
            const currentWeek = m.jWeek();
            for(let i = 0; i<=(6+(6-currentDayOfWeek)); i++){

                const result = this.countReserves( rows, m.format("YYYY/MM/DD") );
        
                const quantity = m.jDay()>=4 && m.jWeek() == currentWeek ?quantities.filter(item => item.isFirstWeek == 1 )[0] : quantities.filter(item => item.isFirstWeek == 0 )[0];
                const condtion = quantity? quantity[[`d${m.jDay()}`]] : 0;

                if(result < condtion ){ 
                    weekFreeTimeWork.push( m.format("YYYY/MM/DD") );
                }
                m.add(1, "day"); 
            }

        }
        else {
            const quantity = await this.CustomerQuantitiy.findAll({ where : { employeeId:employeeId, isFirstWeek : 1 }, 
                attributes : ['d0','d1','d2','d3','d4','d5', 'd6'], raw : true });
            const quantityObj = quantity[0];

            for(let i = currentDayOfWeek; i<=7-currentDayOfWeek; i++){
                const result = this.countReserves( rows, m.format("YYYY/MM/DD") );
                const condtion = quantityObj? quantityObj[[`d${m.jDay()}`]] : 0;
                if(result < condtion){ 
                    console.log(quantityObj[`d${m.jDay()}`] );
                    weekFreeTimeWork.push( m.format("YYYY/MM/DD") );
                }
                m.add(1, "day"); 
            }
        }

        // let now = moment().add(2,"day")
        
        let now = moment();

        let end;
        const start = now.format("YYYY/MM/DD");
        
        if( now.jDay() >= 4)
        {
            // end = left days of this week + days of next week    
            end = now.add(6 + (6-now.jDay() ), "day").format("YYYY/MM/DD");
        }
        else{
            // end = left days of this week + days of next week 
            end = now.add( 6-now.jDay() , "day").format("YYYY/MM/DD");
        }
        console.log(weekFreeTimeWork);

        res.status(200).json({
            result : {
                freeDays : weekFreeTimeWork,
                start,
                end
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
        moment.locale("fa", { useGregorianParser : true });
        // let now = moment().add(2, 'day');
        let now = moment();

        let end;
        const start = now.format("YYYY/MM/DD");
        
        if( now.jDay() >= 4)
        {
            // end = left days of this week + days of next week    
            end = now.add(6 + (6-now.jDay() ), "day").format("YYYY/MM/DD");
        }
        else{
            // end = left days of this week + days of next week 
            end = now.add( 6-now.jDay() , "day").format("YYYY/MM/DD");
        }
        res.status(200).json({
                result : {
                start,
                end 
            },
            success : true
        });
    }
}