const express = require('express');
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");
// const options = {
//     definition: {
//       openapi: "3.0.0",
//       info: {
//         title: "LogRocket Express API with Swagger",
//         version: "0.1.0",
//         description:
//           "This is a simple CRUD API application made with Express and documented with Swagger",
//         license: {
//           name: "MIT",
//           url: "https://spdx.org/licenses/MIT.html",
//         },
//         contact: {
//           name: "LogRocket",
//           url: "https://logrocket.com",
//           email: "info@email.com",
//         },
//       },
//       servers: [
//         {
//           url: "http://localhost:3000/api",
//         },
//       ],
//     },
//     apis: ["./modules/routes/v1/index.js"],
//   };

// app.use(swaggerUi.serve, swaggerUi.setup)
app.use( bodyParser.urlencoded( { extended : false} ) );
app.use( bodyParser.json({ type: "applicarion"}) );
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

require("./modules/models/setRelations") (Person, Employee, Role, Reserve, ServiceCategory, Service);


//set routes
const routes = require("./modules/routes/index");

app.use("/api", routes);


sequelize.sync( { alter : true } ).then( result => {

    console.log("successfully connected to database");
    app.listen( process.env.PORT, () => {
        console.log( "server is listening on port "+process.env.port );
    } );
    
}).catch( err => {
    console.log(err);
})