const bcrypt = require("bcrypt");

const ControllerModels = require('./ControllerModels');
const registerSchema = require("./validationSchema/registerSchema");
const generateJwt = require("../middlewares/generateJwt")

module.exports = new class LoginRegisterController extends ControllerModels { 

    register = (req, res) => {
    
        registerSchema.validate( req.body, { abortEarly: false }).then( validatedData => {

            bcrypt.hash(req.body.password, 10).then( hashed =>  {
                
                const data={
                    ...validatedData,
                    password : hashed
                }

                console.log(data)

                this.Person.create( data, { row : true} ).then( ()=>{
                
                    res.status(200).json({
                        result: "حساب کاربری با موفقیت ایجاد شد",
                        success : true
                    });
    
                }).catch( err => {
                    res.status(422).json({
                        error : err.errors,
                        success : false
                    } )
                });
            
            });


        }).catch( err => {
            console.log(err)
            res.status(422).json({
                error : err.errors,
                success : false
            })
        })

    }

    login = async ( req, res ) => { 

        try{
            const foundPerson = await this.Person.findOne( { where : { phone : req.body.phone, }, raw : true, include: { model : this.Employee} })
            console.log(foundPerson);
            if( foundPerson == undefined || foundPerson == null )
            {
                return res.status(422).json({
                    success : false,
                    error : "شماره موبایل یا رمز عبور وارد شده صحیح نیست"
                });
            }
            
            bcrypt.compare(req.body.password, foundPerson.password, (err, result)=> {
                if( err ) throw err;

                if( result ){
        
                    const authToken = generateJwt( req.body.phone, foundPerson.id, foundPerson['employee.id'], foundPerson['employee.roleId'] );
                    return res.status(200).json({
                        success : true,
                        result : "با موفقیت به حساب کاربری وارد شدید.",
                        authToken 
                    });
                }

                return res.status(422).json({
                    success : false,
                    error : "شماره موبایل یا رمز عبور وارد شده صحیح نیست"
                });

            })
        }
        catch( err ) {
            res.json({
                success : false,
                error : err  
            });
        }
    }

}