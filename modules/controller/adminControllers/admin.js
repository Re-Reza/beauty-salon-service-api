const  { Op, fn, col, where } = require("sequelize");

const moment = require("jalali-moment");

const ControllerModels = require("../ControllerModels");

module.exports = new class Admin extends ControllerModels {

    employeesList = async (req, res) => {
        
        const employees = await this.Employee.findAll({ where : { roleId : { [Op.not] : [2] } }, 
            include : [ {model : this.Person}, {model: this.Role} ] });

        if(employees.length == 0)
            return res.status(200).json({
                result : [],
                success : true
            });
            
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
            const{ personId } = req.params;

            // console.log(req.body);
            //all of varible must have value if they are not suppoesed to change must have default valu
            console.log(req.body.newData)
            const { fName, lName, phone, nationalId, newServices, roleId } = req.body.newData;

            const foundPerson = await this.Person.findOne( { where : { id : personId } });
            foundPerson.phone = phone;
            foundPerson.fName = fName;
            foundPerson.lName = lName;
            await foundPerson.save();
           
            const employee = await foundPerson.getEmployee();
            employee.nationalId = nationalId;
            // employee.roleId = roleId;
            await employee.save();
            let foundServices = [];
            if(newServices.length > 0)
            {
                foundServices = await this.findServices( newServices );
            }
            employee.setServices( foundServices );

            res.status(200).json({
                success : true,
            })
        }
        catch(err){
            console.log(err);
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
                    result : "?????????????? ???? ???????????? ?????????? ????"
                });
            }

            res.status(422).json({
                success : false,
                error : "?????????? ?????????????? ???? ?????? ?????????? ????"
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
            const result = await this.Reserve.update({deleteTime: currentTime}, { where :  {id : req.params.reserveId } });
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : "???? ???????????? ?????? ????"
                });
            }
            console.log(result);
            res.status(422).json({
                success : false,
                error : "?????????? ???? ???????? ??????"
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

            const { reserveDate, employeeIsSearching, history } = req.query;

            const condition = {};
            if( employeeIsSearching == 1){
                condition.employeeId =  req.tokenEmployeeId;
            }            
            if(reserveDate != 'null' && reserveDate.trim() !="")
            {
                condition.reserveDate = reserveDate;
            }
    
            let status;
            if(history == 1){
                status = ["cancelled", "done"];
            }
            else{
                status = ["waiting", "finalized"];
            }

            const secarchResult = await this.Reserve.findAll({ where : { ...condition, status : { [Op.or] : status  } }, raw : true,
            include : [{model : this.Person}, { model : this.Employee, include: { model :this.Person} }, { model : this.Service } ]});

            const transformedData = this.transformData(secarchResult)
    
            res.status(200).json({
                success : true,
                result : transformedData
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
            moment.locale("fa", { useGregorianParser : true} );
            const now = moment().format("YYYY/MM/DD");
            const reserves = await this.Reserve.findAll({ where : { status : { [Op.or] : reserveStatus }, deleteTime : null }, 
            raw : true, include : [{ model: this.Person }, { model: this.Employee, include : { model : this.Person } }, { model: this.Service }] });
            const transformedData = this.transformData(reserves);
            res.status(200).json({
                success : true,
                result : transformedData,
                start : now
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error,
                success : false
            });
        }
    }

    transformData(reserves){
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
                customerPhone : item['person.phone'],
                payment : item.payment
            }
        });
        return transformedData;
    }

    searchReservesByNameOrPhone = async (req, res) => {
        try{
            const { isEmployee, searchValue, history, employeeIsSearching } = req.query;
    
            const conditon = {};
            if(history == 1){
                conditon.status = ["cancelled", "done"];
            }
            else{
                conditon.status = ["waiting", "finalized"];
            }
            if(employeeIsSearching == 1){
                conditon.employeeId = req.tokenEmployeeId;
            }
            console.log(conditon)
            let searchResult;
            if( isEmployee == 1 )
            {
                searchResult = await this.Reserve.findAll({ where : { ...conditon }, required: false,
                include : [{model : this.Employee, required: true, attributes:['id'] , include : { model : this.Person, attributes:['fName', 'lName', 'phone'],where : {
                    [Op.or] : [ 
                        {
                            phone : { [Op.like] : `${searchValue}%` } 
                        },
                        where(fn('concat', col('fName'),' ', col('lName')), {
                            [Op.like]: `${searchValue}%`
                        })
                    ]} } }, {model : this.Person, attributes:['fName', 'lName', 'phone', 'id'] }, {model : this.Service, attributes: ['serviceTitle', 'id']} ] ,raw : true });
            }
            else{
                searchResult = await this.Reserve.findAll({ where : { ...conditon }, required: false,
                include : [ {model : this.Person,  required : true, attributes:["id", "fName", "lName", "phone"],where : { [Op.or] : [
                    {
                        phone : { [Op.like] : `${searchValue}%` } 
                    },
                    where(fn('concat', col('fName'),' ', col('lName')), {
                        [Op.like]: `${searchValue}%`
                    })
                ]} },
                {model : this.Employee, attributes:['id'] , include : { model : this.Person, attributes:['fName', 'lName', 'phone'] } }, 
                {model : this.Service, attributes: ['serviceTitle', 'id']} ] , raw : true });
            }
            
            const transformedData = this.transformData(searchResult);
            // console.log(transformedData);
            res.status(200).json({
                success : true,
                result : transformedData
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

    searchEmployee = async (req, res) => {
        try{
            const { data } = req.query;
            // console.log(data)
            const allUsers = await this.Person.findAll({ 
                where : { [Op.or] : [
                    {
                        phone : { [Op.like] : `${data}%` } 
                    },
                    where(fn('concat', col('fName'),' ', col('lName')), {
                        [Op.like]: `${data}%`
                    })
                ], }  
                , raw :true, include : [{model : this.Employee, include:{model:this.Service},attributes : ["id", "nationalId", "roleId"]}], attributes : ["id", "fName", "lName", "phone", "profileImg"]
            });

            const searchedEmployees = allUsers.filter( user => user['employee.id'] != null && user['employee.roleId'] != 2);
            // console.log(searchedEmployees)
            let searchResult=[];
            searchedEmployees.forEach( item => {
                const foundItem = searchResult.find( s => s.employeeId == item['employee.id']);
                if( !foundItem ){    
                    const currentEmployee = searchedEmployees.filter( em => em.id == item.id);
                    let services = [];
                    const emData = {
                        employeeId : item['employee.id'],
                        nationalId : item['employee.nationalId'],
                        fName : item.fName,
                        lName : item.lName,
                        phone : item.phone,
                        profileImg : item.profileImg
                    };
                    if(currentEmployee.length == 0 && currentEmployee['employee.services.serviceTitle'] == null) 
                    {
                        searchResult.push({
                            ...emData,
                            services
                        });
                    }
                    else{
                        currentEmployee.forEach(i => {
                            services.push({
                                serviceTitle:i['employee.services.serviceTitle'],
                                serviceId : i['employee.services.id']
                            });
                        });
                        searchResult.push({
                            ...emData,
                            services
                        })
                    }
                }
            });      
            console.log(searchResult);
            res.status(200).json({
                success : true,
                result : searchResult
            }); 
        }
        catch( err ){
            // console.log(err);
            res.status(500).json({
                success : false,
                error : err
            });
        }
    }
}