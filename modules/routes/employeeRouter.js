const router = require('express').Router();
const weeklyCustomerQuantity =  require(setPath.controllerPath+"/employeeControllers/weeklyCustomerQuantity");
const authenticateToken = require("../middlewares/authenticateToken");
const authenticateEmployee =require("../middlewares/authenticateEmployee");
const employeeDashController = require(setPath.controllerPath+"/employeeControllers/employeeDashController");
const changInfo = require(setPath.controllerPath+"/userDashControllers/userDashboard").changeUserInfo;

router.post("/setWeeklyCustomerQuantity",  authenticateToken, authenticateEmployee, weeklyCustomerQuantity.setCustomerQuantity );

router.get("/providePlanDates", authenticateToken, authenticateEmployee, weeklyCustomerQuantity.providePlanDates );

router.get("/provideEmployeeInfo", authenticateToken, authenticateEmployee, employeeDashController.provideEmployeeInfo );

//this route will extract all reserves of employee in front can categorize them into history and current
router.get("/extractCustomerList", authenticateToken, authenticateEmployee, employeeDashController.extractCustomerList );

router.put("/editDateAndTime/:reserveId", authenticateToken, authenticateEmployee, employeeDashController.editDateAndTime );

router.put("/finalizeReserve/:reserveId", authenticateToken, authenticateEmployee, employeeDashController.finalizeReserve );

router.get("/messages", authenticateToken, authenticateEmployee, employeeDashController.generateMessages ); 

//national Id can't be chaned by employee
router.post("/editInfo", authenticateToken, authenticateEmployee, changInfo );


module.exports = router;