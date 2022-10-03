const express = require("express");
const router = express.Router();

const reserController = require(setPath.controllerPath+"/reserveController");
const authenticateToken = require('../middlewares/authenticateToken');

router.get("/provideCategories", reserController.provideCategories );
router.get("/provideServicesOfCategory/:categoryId", reserController.provideServicesOfCategory );

router.post("/addReserve", reserController.addReserve);

//service and date was selected and want to find employee 
router.post("/getEmployeesOfDate", reserController.extractEmployeesOfDate);

//user had receivied list of employees of selected service this router will extract weekly time work of selecting employee
router.get("/getTimeWorkOfEmployee", reserController.extractEmployeeTimeWork)

//by selecting a service this route will find all employees of that service ( this is for when user want to reserve based on employee)
router.get("/extractEmployeesOfService", reserController.extractEmployeesOfService)

module.exports = router;