// const { Router } = require("express");
// const router = new Router();
const router = require('express').Router();

const authenticateToken = require('../middlewares/authenticateToken');
const authenticateEmployee = require('../middlewares/authenticateEmployee');

const serviceController = require(setPath.controllerPath+"/adminControllers/serviceController");
const employeeController = require(setPath.controllerPath+"/adminControllers/employeeController");
const admin = require(setPath.controllerPath+"/adminControllers/admin");
const adminMessage = require(setPath.controllerPath+"/adminControllers/adminMessage");
const productController = require(setPath.controllerPath+"/adminControllers/productController");

router.post("/addNewServiceCategoey", authenticateToken, authenticateEmployee,  serviceController.addNewServiceCategoey );

router.delete("/deleteService", authenticateToken, authenticateEmployee, serviceController.deleteService );

router.post("/addNewEmployee", authenticateToken, authenticateEmployee, employeeController.addNewEmployee );

//use provideEmployeeInfo to get admin info

router.get("/allEmployeesList", authenticateToken, authenticateEmployee, admin.employeesList );

// router.get("/provideEmployeeSerives/:employeeId", authenticateToken, authenticateEmployee , admin.extractEmployeeServeces );

router.get("/proviceServices", authenticateToken, authenticateEmployee, admin.extractServices );

router.get("/provideRoles", authenticateToken, authenticateEmployee, admin.extractRoles );

router.put("/editEmployeeInfo/:personId", authenticateToken, authenticateEmployee, admin.editEmployeeInfo );

//use router.get("/extractReserves/:employeeId", authenticateToken, authenticateEmployee, employeeDashController.extractReserves ); 
//to get reserves of employee 

//for changing admin info must send SMS

//to vhange date and time of reserve use below which belongs to emplpoyee router:
//router.put("/editDateAndTime/:reserveId", authenticateToken, authenticateEmployee, employeeDashController.editDateAndTime );
// router.put("/editTimeAndDate/:reserveId", authenticateToken, authenticateEmployee, admin. );

router.put("/chageReserveStatus/:reserveId", authenticateToken, authenticateEmployee, admin.changeReserveStatus );

router.delete("/deleteReserve/:reserveId", authenticateToken, authenticateEmployee, admin.deleteReserve );

//this route is used for employee dashboard to search by date too, for employee we dont send employeeId in query
router.get("/searchInReservesByDate", authenticateToken, authenticateEmployee, admin.searchInReservesByDate );

//give wanted status in query as list
router.get("/extractReservesByStatus", authenticateToken, authenticateEmployee, admin.extractReservesByStatus );
router.get("/searchReservesByNameOrPhone", authenticateToken, authenticateEmployee, admin.searchReservesByNameOrPhone );

router.get("/searchEmployee", authenticateToken, authenticateEmployee, admin.searchEmployee );

router.post("/sendMessage", authenticateToken, authenticateEmployee, adminMessage.sendMessage );

router.delete("/deleteMessage/:messageId", authenticateToken, authenticateEmployee, adminMessage.deleteMessage)

router.get('/allAdminMessages', authenticateToken, authenticateEmployee, adminMessage.provideAllMessages );

router.get('/provideCategoriesServices', authenticateToken, authenticateEmployee, serviceController.provideCategoriesServices);

router.post('/addNewProduct', authenticateToken, authenticateEmployee, productController.addNewProduct );

module.exports = router; 