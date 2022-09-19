const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

//we use seagger-jsdoc to set specificetions and swagger-ui to create ui 
function setSwaggerUi(app) { 

    const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "beauty-salon-api",
            version: "0.1.0",
            description: "Apis of beauty-salon project"  
        },
        servers: [
            {url: "http://localhost:4000/"},
        ],
        },
        apis: ['../../app.js'],
        
    };
    const swaggerSpec = swaggerJsdoc( options );

    /** 
     * @swagger 
     *  /api/register:
     *           post:
     *           description: register new user 
     * 
     * **/

    app.use("/swagger", swaggerUi.serve,  swaggerUi.setup(swaggerSpec)  );

}

module.exports = setSwaggerUi;