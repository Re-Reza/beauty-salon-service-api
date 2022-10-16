const ControllerModels = require("../ControllerModels");
const moment = require("jalali-moment");

module.exports = new class WeeklyCustomerQuantity extends ControllerModels { 
    
    setCustomerQuantity = async ( req, res ) => {
        try{
            const { tokenEmployeeId } = req;
            const { d0, d1, d2, d3, d4, d5, d6 } = req.body;
            const isFirstWeek = req.query.isFirstWeek == 0 ? false : true;  

            const data = {
                d0 : d0 == "" || d0==null ? 0 : parseInt(d0),
                d1 : d1 == "" || d1==null ? 0 : parseInt(d1),
                d2 : d2 == "" || d2==null ? 0 : parseInt(d2),
                d3 : d3 == "" || d3==null ? 0 : parseInt(d3),
                d4 : d4 == "" || d4==null ? 0 : parseInt(d4),
                d5 : d5 == "" || d5==null ? 0 : parseInt(d5),
                d6 : d6 == "" || d6==null ? 0 : parseInt(d6),
            };

            console.log(data);
            const counter = await this.CustomerQuantitiy.count({ where : {employeeId : tokenEmployeeId, isFirstWeek} });
           
            if(counter == 0)
            {
                await await this.CustomerQuantitiy.create({...data, employeeId : tokenEmployeeId, isFirstWeek});  
            }
            else{
                await this.CustomerQuantitiy.update(data, { where : {employeeId : tokenEmployeeId, isFirstWeek}});
            }
            res.status(200).json({
                result : data,
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

    providePlanDates = async (req, res) => {

        try{
            const { tokenEmployeeId } = req;
            moment.locale('fa', { useGregorianParser: true } );
            const now = moment();
            console.log(now)
            const result = {};
            let temp = [];
            // now.add(5, "day");
            for(let i = now.jDay(); i<=12; i++){
                if( i == 6 ){
                    result.firstWeek = { 
                        list : temp
                    }
                    // result.firstWeek = temp;
                    temp = [];
                    now.add(1, "day");
                    continue;
                }
                if( i == 12 ){
                    result.secondWeek = { 
                        list : temp
                    }
                    // result.secondWeek = temp;
                }
                temp.push( {
                    date : now.format("YYYY/MM/DD"),
                    dayOfWeek : now.jDay()
                } );
                now.add(1, "day");
            } 
            console.log(result)
            const quantities = await this.CustomerQuantitiy.findAll({ where : { employeeId : tokenEmployeeId }, 
                attributes: ['d0','d1','d2','d3','d4','d5', 'd6', 'isFirstWeek'], raw :true });
            console.log(quantities);
            result.firstWeek.numbers = quantities.find( item => item.isFirstWeek == 1);
            result.secondWeek.numbers = quantities.find( item => item.isFirstWeek == 0);
                
            console.log(result.firstWeek)
            
            res.status(200).json({
                success: true,
                result
            });
        }
        catch( err ){
            console.log(err);
            res.status(500).json({
                error : err,
                success : false
            });
        }
    } 

}