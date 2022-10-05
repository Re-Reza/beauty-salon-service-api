const ControllerModels = require("../ControllerModels");
const { Op } = require("sequelize");

const { unlinkSync } = require("fs")
const path = require("path");

const bcryptUtils = require("../../middlewares/bcryptUtils");

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
    
    // extractReservesHistory = async ( req, res) => {
    //     const { tokenPhone, tokenPersonId} = req;
    //     this.extractReserves( tokenPersonId, ['done', 'cancelled'] ).then( reserveDate => {
    //         res.status(200).json({
    //             success : true,
    //             result : reserveDate
    //         });
    //     }).catch( err =>{ 
    //         console.log(err);
    //         res.status(500).json({
    //             success : false,
    //             error : err
    //         });
    //     });
    // }

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
            // const m = await this.Message.findAll({ where : { messageType : { [Op.or] : [2, 3]}}, include: [ { model : this.MessageReaders} ], raw : true });
            let reserveMessages;
            let sqlCondition;
            //for Employees 
            if( tokenEmployeeId && tokenRoleID !=2 ) 
            {
                reserveMessages = await this.Reserve.findAll({ where : { employeeId : tokenEmployeeId, deleteTime : null }, raw : true, include : [ {model : this.Person, attributes:["id", "fName", "lName", "phone"]}, {model : this.Service}] });
                sqlCondition = [1, 3];
            }
            else if( tokenEmployeeId && tokenRoleID == 2 ){ //for admin 
                reserveMessages = await this.Reserve.findAll({ where : { employeeId : tokenEmployeeId, deleteTime : null }, raw : true, include : [ {model : this.Person}, {model : this.Employee,  attributes:["id"], include : { model : this.Person, attributes:["id", "fName", "lName", "phone"]} }, {model : this.Service}] });
                sqlCondition = [1, 2, 3];
            }
            else{ //for customers
                reserveMessages = await this.Reserve.findAll({ where : { customerId : tokenPersonId, deleteTime : null }, 
                raw : true, include : [ {model : this.Employee, attributes:["id"], include : { model : this.Person, attributes:["id", "fName", "lName", "phone"] } }, {model : this.Service}] });
                sqlCondition = [2, 3];
            }

            let messages = await this.Message.findAll({ where : { messageType : { [Op.or] : sqlCondition }, deleteTime : null}, raw : true });
            const readMessages = await this.MessageReaders.findAll({ where : { personId : tokenPersonId }, raw : true});
            
            const unreadMessages = {
                systemMessages : [],
                adminMessages : []
            };
            
            messages.forEach( message => {
                const isValid = this.checkMessage(message.id, readMessages, "messageId");
                if( isValid ) 
                    unreadMessages.adminMessages.push(message);
            }); 
            
            reserveMessages.forEach( message => {
                const isValid = this.checkMessage(message.id, readMessages, "reserveMessageId");
                if( isValid ) 
                    unreadMessages.systemMessages.push(message);
            });

            console.log(unreadMessages);
            res.status(200).json({
                success: true,
                result : unreadMessages
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            })
        }
    }

    checkMessage( messageId, readMessages, key ){
        const foundItem = readMessages.find( item => item[key] == messageId );
        return foundItem ? false : true;
    }

}
