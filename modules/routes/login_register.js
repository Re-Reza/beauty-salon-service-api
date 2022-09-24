const express = require("express");
const router = express.Router();
console.log(setPath)
const loginRegisterController = require(setPath.controllerPath+"/loginRegisterController");


router.post("/register", loginRegisterController.register);

router.post("/login", loginRegisterController.login);



module.exports = router;