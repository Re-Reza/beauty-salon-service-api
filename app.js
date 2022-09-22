const express = require('express');
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

require("./modules/utilties/swaggerUi")( app );


app.use( bodyParser.urlencoded( { extended : false} ) );
app.use( bodyParser.json({ type: "application/json"} ) );
//set initial configuration
dotenv.config({
    path: "./modules/configs/config.env"
});
const path = require("./modules/utilties/path");
global.setPath = path; 


//set models 
const sequelize = require(setPath.configPath+"/database")
require("./modules/models/setRelations") ();


//set routes
const routes = require("./modules/routes/index");
app.use("/api", routes);


sequelize.sync( { alter : true } ).then( result => {

    console.log("successfully connected to database");
    app.listen( process.env.PORT, () => {
        console.log("server is listening on port "+process.env.port );
    } );
    
}).catch( err => {
    console.log(err);
})