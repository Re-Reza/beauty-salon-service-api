const { Router } = require('express');
const router = new Router();

const loginRegister = require("./login_register");
const adminRouter = require("./adminRouter");
const reserveRouter = require("./reserveRouter");
const employeeRouter = require('./employeeRouter');
const userDashRouter = require("./userDashRouter");
const homeRouter = require("./homeRouter");

router.use( loginRegister);
router.use("/admin", adminRouter);
router.use("/reserve", reserveRouter);
router.use("/employeeDashboard", employeeRouter);
router.use("/userDashboard", userDashRouter);
router.use("/home", homeRouter);

module.exports = router;