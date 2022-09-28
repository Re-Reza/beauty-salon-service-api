// const { Router } = require("express");
// const router = new Router();
const router = require('express').Router();

const authenticateToken = require('../middlewares/authenticateToken');
const authenticateEmployee = require('../middlewares/authenticateEmployee');

const serviceController = require(setPath.controllerPath+"/adminControllers/serviceController");
const employeeController = require(setPath.controllerPath+"/adminControllers/employeeController");
const admin = require(setPath.controllerPath+"/adminControllers/admin");

//ایا با توجه به اینکه این ای پی ای ها در داشپورد هستند و برای دسترسی به داشپورد هم اعتبار سنجی میشود آیا لازم است پیش از استفاده از هر ای ئی ای اعتبار سنجی شود؟

//LCV9c9 => admin password
// 9900 => admin phone 

router.post("/addNewServiceCategoey", serviceController.addNewServiceCategoey );

router.delete("/deleteService", serviceController.deleteService );

router.post("/addNewEmployee", employeeController.addNewEmployee );

//use provideEmployeeInfo to get admin info

router.get("/allEmployeesList",  authenticateToken, authenticateEmployee, admin.employeesList );

// router.get("/provideEmployeeSerives/:employeeId", authenticateToken, authenticateEmployee , admin.extractEmployeeServeces );

router.get("/proviceServices", authenticateToken, authenticateEmployee, admin.extractServices );

router.get("/provideRoles", authenticateToken, authenticateEmployee, admin.extractRoles );

router.put("/editEmployeeInfo/:personId/:employeeId", authenticateToken, authenticateEmployee, admin.editEmployeeInfo );

//use router.get("/extractReserves/:employeeId", authenticateToken, authenticateEmployee, employeeDashController.extractReserves ); 
//to get reserves of employee 

//for changing admin info must send SMS


module.exports = router; 