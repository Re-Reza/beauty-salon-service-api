const router = require('express').Router();
const weeklyCustomerQuantity =  require(setPath.controllerPath+"/employeeControllers/weeklyCustomerQuantity");

router.post("/setWeeklyCustomerQuantity", weeklyCustomerQuantity.setCustomerQuantity );

module.exports = router;