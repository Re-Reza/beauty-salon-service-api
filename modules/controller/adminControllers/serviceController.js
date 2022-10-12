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
        const { serviceCategory : {id, categoryTitle}, service } = req.body;
        console.log(service)
        if( id ){
            try{
                const foundService = await this.ServiceCategory.findOne( { where : {id: id}});
                // const createdServices = await this.Service.bulkCreate( services );
                const createdService = await this.Service.create( {serviceTitle : service});
                await foundService.addServices(createdService); 
                res.status(200).json({
                    success : true,
                    result : createdService
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
                const createdService = await this.Service.create( { serviceTitle : service } );
                const r = await createdCategory.addServices(createdService);
                console.log("first");
                console.log(r.toJSON());
                res.status(200).json({
                    success : true,
                    result : {
                        createdCategory,
                        createdService
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

    provideCategoriesServices = async (req, res) => {
        try { 
            const result = await this.ServiceCategory.findAll({ include : {model : this.Service} });

            const transformedData = result.map( item => {
                    return item.toJSON();
            });

            res.status(200).json({
                result : transformedData,
                success : true
            });
        }
        catch( error )
        {
            console.log(err)
            res.status(500).json({
                success : false,
                error : err
            });
        }
    }
    
}