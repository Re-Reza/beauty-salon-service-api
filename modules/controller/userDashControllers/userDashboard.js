const ControllerModels = require("../ControllerModels");

module.exports = new class UserDashboard extends ControllerModels {

    extractUserInfo = async(req, res) => {
        try{
            //these parameters was added from authenticateToken 
            const { tokenPhone, tokenPersonId} = req;
            //extract img path from database
            const foundUser = await this.Person.findByPk(tokenPersonId, { attributes:["id","fName", "lName", "username", "phone"] ,raw : true} );
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

    extractCurrentUserReserves = async ( req, res ) => {
        try{
            const { tokenPhone, tokenPersonId} = req;
            const reserves = await this.Reserve.findAll( { where : { customerId : tokenPersonId, status : "waiting" } })
            // const  reserves = await this.Person.findAll({ where: { id: tokenPersonId }, include : [{model : this.Reserve], raw: true});
            console.log(reserves[0]["_previousDataValues"]); 
        
               
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                success : false,
                error : err
            });
        }
        
    }

}
