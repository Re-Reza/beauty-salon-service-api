const express = require("express");
const router = express.Router();

const reserController = require(setPath.controllerPath+"/reserveController");

router.post("/getEmployeesOfDate", reserController.extractEmployeesOfDate)
router.post("/addReserve", reserController.addReserve);


module.exports = router;