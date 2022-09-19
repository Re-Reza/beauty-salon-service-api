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


//models 
const sequelize = require("./modules/configs/database");
const Person = require("./modules/models/Person");
const Employee = require("./modules/models/Employee");
const Role = require("./modules/models/Role");
const Reserve = require("./modules/models/Reserve");
const ServiceCategory = require("./modules/models/ServiceCategoey");
const Service = require("./modules/models/Service");
const CustomerQuantitiy = require("./modules/models/CustomerQuantitiy");

require("./modules/models/setRelations") (Person, Employee, Role, Reserve, ServiceCategory, Service, CustomerQuantitiy);


//set routes
const routes = require("./modules/routes/index");

app.use("/api", routes);


sequelize.sync( { alter : false } ).then( result => {

    console.log("successfully connected to database");
    app.listen( process.env.PORT, () => {
        console.log("server is listening on port "+process.env.port );
    } );
    
}).catch( err => {
    console.log(err);
})