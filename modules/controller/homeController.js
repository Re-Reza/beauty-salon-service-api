const bcrypt = require("bcrypt");

const ControllerModels = require('./ControllerModels');
const moment = require("jalali-moment");

module.exports = new class HomeController extends ControllerModels { 

    provideUserInfo = async (req, res) => {
        try{
            console.log("first")
            moment.locale("fa", { useGregorianParser : true });
            const currentTime = moment().format("YYYY/MM/DD");
            const { tokenPersonId } = req;
            const data = await this.Person.findByPk( tokenPersonId, { raw : true, attributes : ['fName', 'lName', 'phone', 'profileImg']} );
            console.log(data);
            
            res.status(200).json({
                result : {
                    data,
                    date : currentTime
                }
            });
        }
        catch( err ) { 
            req.status(500).json({
                success : false,
                error : err
            });
        }
    }

}