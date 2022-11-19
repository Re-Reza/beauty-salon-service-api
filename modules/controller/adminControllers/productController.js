const ControllerModels = require("../ControllerModels");
const provideCreationTime = require("../../utilties/provideCreationTime");

module.exports = new class ProductController extends ControllerModels {

    addNewProduct = async ( req, res ) => {
        try { 
            const { ProductTitle, price, description, imgs} = req.body;
            const createdProduct = await this.Product.create({ ... req.body, creationTime : provideCreationTime() });
            console.log(createdProduct);
            res.status(200).json({
                success : true,
                result : createdProduct
            });
        }
        catch ( error ) {
            console.log(error);
            res.status(500).json({
                success : false,
                error
            });
        }
    }

    deleteProduct = async ( req, res ) => {

    } 
} 