// const { Router } = require("express");
// const router = new Router();
const router = require('express').Router();

const authenticateToken = require('../middlewares/authenticateToken');
const adminController = require(setPath.controllerPath+"/adminController");

router.post("/addNewEmployee", authenticateToken, adminController.addNewEmployee );
router.post("/addNewServiceCategoey", authenticateToken, adminController.addNewServiceCategoey );
router.post("/addNewService", authenticateToken, adminController.addNewService );

module.exports = router; 