const ControllerModels = require('../ControllerModels');

module.exports = new class AdminController extends ControllerModels {   

    addNewEmployee = async (req, res) => {
        try{
            //must validata body data 
            console.log(req.body)
            const result = await this.Employee.create(req.body);
            res.status(200).json({
                success : true,
                result
            });
        }
        catch(err){
            res.status(422).json({
                success : false,
                error : err
            });
        }
    }

    addNewServiceCategoey = async (req, res) => {
/*      {
            serviceCategoey : {
                id:,
                title: 
            },
            services : [] services related to send serviceCategoey
        }*/
        const { serviceCategoey : {id, categoryTitle}, services } = req.body;
        if( id ){
            console.log("here1");
            try{
                const foundService = await this.ServiceCategory.findOne( { where : {id: id}});
                const createdServices = await this.Service.bulkCreate( services );
                await foundService.addServices(createdServices); 
                res.status(200).json({
                    success : true,
                    result : {
                        foundService,
                        createdServices
                    }
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
        else{
            try { 
                const createdCategory = await this.ServiceCategory.create({ categoryTitle });
                const createdServices = await this.Service.bulkCreate( services );
                createdCategory.addServices(createdServices);
                res.status(200).json({
                    success : true,
                    result : {
                        createdCategory,
                        createdServices
                    }
                });
            }   
            catch ( err ){
                res.status(500).json({
                    success : false,
                    error : err
                });
            }
        }
    }

    deleteService = async ( req, res ) => {

        //  /deleteService? deleteSevice = 1 / 0 & id = 
        let result;
        console.log(req.query)
        try{
            if( req.query.deleteSevice == 1 ){
                result = await this.Service.destroy( { where : { id : req.query.id } } ); 
            }
            else{
                result = await this.ServiceCategory.destroy( { where : { id : req.query.id } } ) 
            }

            return res.status(200).json({
                success: true,
                result: result
            });
        }
        catch( err ) {
            res.status(500).json({
                success : false,
                error : err
            });
        }
    } 

}