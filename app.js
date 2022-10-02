const express = require('express');
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./modules/utilties/swaggerUi")( app );

const path = require("path");

app.use( cors( {
    //valid origins that are allowed to request api
    origin: ['http://localhost:3000'],
    credentials:true,
    optionSuccessStatus:200,
    methods : ['GET', 'POST', 'PUT', 'DELETE']
}) );

app.use( bodyParser.urlencoded( { extended : false} ) );
app.use( bodyParser.json({ type: "application/json"} ) );
//set initial configuration
dotenv.config({
    path: "./modules/configs/config.env"
});

const setPath = require("./modules/utilties/path");
global.setPath = setPath; 

// public folder (which was given to express static will be ignored and must not mentioned so we can add route /publix)
app.use("/public" ,express.static( path.join(__dirname, "public") ) );

//set models 
const sequelize = require(setPath.configPath+"/database")
require("./modules/models/setRelations")();


//set routes
const routes = require("./modules/routes/index");
app.use("/api", routes);


sequelize.sync({ alter : false }).then( result => {

    console.log("successfully connected to database");
    app.listen( process.env.PORT, () => {
        console.log("server is listening on port "+process.env.port );
    } );
    
}).catch( err => {
    console.log(err);
})