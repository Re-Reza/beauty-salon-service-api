// const { Router } = require("express");
// const router = new Router();
const router = require('express').Router();

const authenticateToken = require('../middlewares/authenticateToken');
const serviceController = require(setPath.controllerPath+"/adminControllers/serviceController");
const employeeController = require(setPath.controllerPath+"/adminControllers/employeeController");

//ایا با توجه به اینکه این ای پی ای ها در داشپورد هستند و برای دسترسی به داشپورد هم اعتبار سنجی میشود آیا لازم است پیش از استفاده از هر ای ئی ای اعتبار سنجی شود؟

router.post("/addNewServiceCategoey", serviceController.addNewServiceCategoey );
router.delete("/deleteService", serviceController.deleteService );

router.post("/addNewEmployee", employeeController.addNewEmployee );


module.exports = router; 