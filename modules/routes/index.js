const { Router } = require('express');
const router = new Router();

const loginRegister = require("./login_register");
const adminRouter = require("./adminRouter");
const reserveRouter = require("./reserveRouter");
const employeeRouter = require('./employeeRouter');
const userDashRouter = require("./userDashRouter");

router.use( loginRegister);
router.use("/admin", adminRouter);
router.use("/reserve", reserveRouter);
router.use("/employee", employeeRouter);
router.use("/userDashboard", userDashRouter);

module.exports = router;