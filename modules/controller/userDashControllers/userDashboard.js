const ControllerModels = require("../ControllerModels");
const { Op } = require("sequelize");
const { unlinkSync } = require("fs")
const path = require("path");

const bcryptUtils = require("../../middlewares/bcryptUtils");
const moment = require("jalali-moment");

module.exports = new class UserDashboard extends ControllerModels {

    extractUserInfo = async(req, res) => {
        try{
            //these parameters was added from authenticateToken 
            const { tokenPhone, tokenPersonId} = req;
            //extract img path from database
            const foundUser = await this.Person.findByPk(tokenPersonId, { attributes:["id","fName", "lName", "profileImg", "phone"] ,raw : true} );
        
            console.log(foundUser);
            res.status(200).json({
                success: true,
                result : foundUser
            });

        }
        catch(err){
            console.log(err);
            res.status(500).json({
                success : false,
                error : err
            });
        }
    }

    extractReserves = async( userId, reserveType )  => {
        
        try{ 
            //has important tip : including parent table in child table became possible because of child.belongsTo( Parent )
            const reserves = await this.Reserve.findAll({ where : { customerId : userId, status : { [Op.or] : [ ...reserveType] } }, 
                include : [{model : this.Employee, include : {model : this.Person}}, { model : this.Service}], raw : true}); 
            const reservesData = reserves.map( item => {
                return {
                    id: item.id,
                    reserveDate  : item.reserveDate,
                    status : item.status,
                    employeefName : item["employee.person.fName"],
                    employeelName : item["employee.person.lName"],
                    employeeId : item["employee.person.id"],
                    service : item["service.serviceTitle"],
                    reserveTime : item.reserveTime
                }
            } );

            return reservesData;
        }
        catch(err) {
            //if instead of throwing err return in er wont move to catch block when we call this method, throw cause going to catch block
            throw err; 
        }
    }

    provideRerserveList = ( req, res ) => {
        const { tokenPhone, tokenPersonId} = req;
        const statusCodition = req.query.isHistory == 1 ? ['done', 'cancelled'] : ['waiting', 'finalized'];  
        this.extractReserves( tokenPersonId, statusCodition).then( reserveDate => {
            res.status(200).json({
                success : true,
                result : reserveDate
            });
                
        }).catch( err => {
            console.log(err);
            res.status(500).json({
                success : false,
                error : err
            });
        });
    }

    deleteReserve = async ( req, res ) => {
   
        try {
            const { params: {reserveId}, tokenPersonId } = req;  
            //if item was not finalized user has delete option 
            const result = await this.Reserve.update({status : "cancelled"} ,{ where : { id : reserveId, customerId : tokenPersonId, status : "waiting", deleteTime : null } })
            if(result == 0) {
                return res.status(422).json({
                    success : false,
                    error : "آیتم مورد نظر پیدا نشد"
                });
            }
            res.status(200).json({
                success : true,
                result : "با موفقیت کنسل شد"
            });
        }
        catch( err) {
            console.log(err);
            res.status(500).json({
                sucess : false,
                error : err
            });
        }
    }

    changeUserInfo = async ( req, res ) => {
        //first check password i password was correct update info of user
        //define an Yup schema for validation
        try{
            const { tokenPersonId } = req;
            const { password, fName, lName, phone} = req.body;

            const user = await this.Person.findByPk( tokenPersonId, { raw : true} );
            bcryptUtils.validatePassword(password, user.password, async ( result )=>{
          
                if( !result ) {
                    return res.status(422).json({
                        success : false,
                        error : "رمز عبور وارد شده صحیح نمی باشد"
                    });
                }

                let newHashedPass;
                if(req.body.newPassword && req.body.newPassword.trim !="" ){
                    newHashedPass = await bcryptUtils.hashPassword( req.body.newPassword );
                }
                
                const newData = {
                    fName : fName.trim() == ""? user.fName : fName,
                    lName : lName.trim() == ""? user.lName : lName,
                    phone : phone.trim() == ""? user.phone : phone
                }
    
                await this.Person.update( {...newData, password: newHashedPass ? newHashedPass : user.password}, 
                    { where : { id : tokenPersonId } });
        
                res.status(200).json({
                    success : true,
                    result : "اطلاعات با موفقیت بروزرسانی شد"
                });

            });

        }
        catch( err ){
            console.log(err);
            res.status(500).json({
                error: err,
                success: false
            })
        }
    } 

    uploadProfileImage = async (req, res) => {

        try{
            const { tokenPersonId } = req;
            // req.file is accessible because of the middleware that we has beeb setted before this controller
            if( !req.file && req.query.isDelete !=1 ){
                return res.status(422).json({
                    success : false,
                    result : "در آپلود فایل خطایی رخ داده است"
                });
            }
            // console.log(req.file)
            const foundUser = await this.Person.findByPk( tokenPersonId, { raw : true} );
            if( foundUser.profileImg ) {
                const filePath = path.dirname(process.mainModule.filename)+"/"+foundUser.profileImg;
                unlinkSync( filePath ); 
            }
            
            const newProfilePath = req.file ? req.file.path.replace(/\\/g, '/') : null ;
            await this.Person.update( { profileImg: newProfilePath }, { where : { id : tokenPersonId } } );
            //"http://localhost:"+process.env.PORT+"/"
            res.status(200).json({
                success : true,
                result : newProfilePath ? newProfilePath : null //replace can get regex asargument
            });
        }
        catch( err ) {
            console.log(err);
            res.status(500).json({
                success : false,
                error : err
            })
        }
    } 

    extractMessages = async (req, res) => {
        try{

            const { tokenPersonId, tokenEmployeeId, tokenRoleID } = req;
            let sqlCondition;
            let reserveConditon;
            //for Employees 
            if( tokenEmployeeId && tokenRoleID !=2 ) 
            {
                sqlCondition = [1, 3];
                reserveConditon = { 
                    employeeId : tokenEmployeeId,
                };
            }
            else if( tokenEmployeeId && tokenRoleID == 2 ){ //for admin 
                sqlCondition = [1, 2, 3];
                reserveConditon = {}
            }
            else{ //for customers
                sqlCondition = [2, 3];
                reserveConditon = {
                    customerId : tokenPersonId,
                }
            }

            const reserveMessages = await this.Reserve.findAll({ where : { ...reserveConditon, deleteTime : null }, 
                include : [ 
                { model : this.Service, attributes:["id", "serviceTitle"]}, { model : this.Person, attributes:["fName", "lName", "phone"]},
                { model : this.Employee, attributes:[], include : { model : this.Person, attributes:["fName", "lName", "phone"] } } 
            ]
            , raw : true });

            const transformedReserveMessages = reserveMessages.map(item => ({
                reserveId : item.id,
                reserveDate : item.reserveDate,
                status : item.status,
                reserveTime : item.reserveTime,
                customerId : item.customerId,
                employeeId : item.employeeId,
                serviceTitle : item['service.serviceTitle'],
                serviceId : item["service.id"],
                customerName : item['person.fName']+" "+item['person.lName'],
                customerPhone: item['person.phone'],
                employeeName : item['employee.person.fName']+" "+item['employee.person.lName'],
                employeePhone : item['employee.person.phone']
            }) );

            // console.log(transformedReserveMessages)

            // const messagesFromAdmin = await this.Message.findAll({ where : { messageType : { [Op.or] : sqlCondition }}, 
                // include : [ { model : this.MessageReaders, as : "messageReaders" ,  through : { where : { personId : { [Op.not] : 16 }  } }  }], raw : true });
        
            // const messagesFromAdmin = await this.Message.findAll({ where : { messageType : { [Op.or] : sqlCondition } }, 
            //  include : [ { model : this.MessageReaders, where : {'$messageReaders.personId$' : { [Op.not] : 16} } ,required : false  }], raw : true });
        
            const messagesFromAdmin = await this.Message.findAll({ where : { messageType : { [Op.or] : sqlCondition } }, raw : true });

            const readMessages = await this.MessageReaders.findAll({ where : { personId : tokenPersonId }, raw : true });
            
            let allMessages = [...transformedReserveMessages, ...messagesFromAdmin ];

            readMessages.forEach( item => {
                let key1;
                let key2;
                if( item.reserveMessageId )
                {
                    key1 = 'reserveMessageId';
                    key2 = 'reserveId';
                }
                else    
                {    
                    key1 = 'messageId';
                    key2 = 'id';
                }
                allMessages = allMessages.filter( message => message[key2] != item[key1]);
            });

            res.status(200).json({
                success: true,
                result : allMessages
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

    readMessage = async (req, res) => {

        try{

            const { tokenPersonId, body : { isReserve, messageId} } = req;

            const data = ( isReserve == 1 ? { reserveMessageId : messageId } : { messageId } )
                console.log(data)
            await this.MessageReaders.create({ personId : tokenPersonId, ...data });

            res.status(200).json({
                success : true,
            });
        }
        catch( error){
            console.log(error);
            res.status(500).json({
                success : false,
                error 
            });
        }
    }

    generalInfo = async (req, res) => {
        try{
            const { tokenPersonId } = req;
            moment.locale("fa", { useGregorianParser : true });
           
            const data = await this.Person.findByPk( tokenPersonId, { raw : true, attributes : ["profileImg", "fName", "lName", "id"]})
            console.log(data)
            res.status(200).json({
                result : {
                    ...data,
                    date : moment().format("YYYY/MM/DD")
                },
                success : true
            })
        }
        catch( err ){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });
        }
    }
    
    searhReserveByDate = async (req, res) => {
        try{
            const { date, isHistory } = req.query;
            const condition = {};
            if(isHistory == 1){
                condition.status = ["cancelled", "done"];
            }
            else{
                condition.status = ["waiting", "finalized"];
            }

            const result = await this.Reserve.findAll({ where : { customerId : req.tokenPersonId, ...condition, reserveDate : date }, 
            include : [{ model: this.Person }, { model: this.Employee,include :  { model: this.Person } }, { model : this.Service } ],raw : true });
           
            const transformData = result.map( item => ({
                id : item.id,
                reserveDate : item.reserveDate,
                reserveTime : item.reserveTime,
                employeeId : item['employee.id'],
                employeefName : item['employee.person.fName'],
                employeelName : item['employee.person.lName'],
                emplloyePhone : item['employee.person.phone'],
                status : item.status,
                service : item['service.serviceTitle'],
                serviceId : item['service.id'],
            }) );

            res.status(200).json({
                success : true,
                result : transformData 
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

}
