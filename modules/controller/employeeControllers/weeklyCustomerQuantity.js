const ControllerModels = require("../ControllerModels");
// const moment = require('moment-jalaali')

module.exports = new class WeeklyCustomerQuantity extends ControllerModels { 
    
    setCustomerQuantity = ( req, res ) => {
        // this.CustomerQuantitiy
        // const { customerQuantity, date } = req.body;
        // const m = moment( moment("1401/6/30", 'jYYYY/jM/jD').format('YYYY-M-DD'), 'YYYY-M-DD');
        // console.log(moment("1401/6/31", 'jYYYY/jM/jD').format('YYYY-M-DD') );
        // console.log(moment("1401/6/31", 'jYYYY/jM/jD').format('YYYY-M-DD').split("-") )
        // const splitedDate = moment("1401/5/29", 'jYYYY/jM/jD').format('YYYY-M-DD').split("-") ;
        // const year = parseInt( splitedDate[0] )
        // const month = parseInt( splitedDate[1] )
        // const day = parseInt( splitedDate[2] );
        // console.log(year, month, day)
        // const d = new Date( year, month, day)
        // console.log(d.getDay() )

        // شنبه 0 - جمع 6
        //check numbers to do not exceed 10
        try{
            console.log(req.body);
            const { sat, sun, mon, tues, wed, thurs, friday, employeeId } = req.body;
    
            console.log("here");
    
            this.CustomerQuantitiy.create( {sat , sun, mon, tues, wed, thurs, friday  , employeeId} ).then( result => {
                console.log(result);
                res.status(200).json({
                    success : true,
                    result : result,
                })
            }).catch(err => {
                res.status(500).json({
                    error : err,
                    success : false
                })
            });
        }
        catch( err ){
            console.log(err)
        }
    }
}