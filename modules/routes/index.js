const { Router } = require('express');
const router = new Router();

const loginRegister = require("./login_register");
const adminRouter = require("./adminRouter");
const reserveRouter = require("./reserveRouter");
const employeeRouter = require('./employeeRouter');

router.use( loginRegister);
router.use("/admin", adminRouter);
router.use("/reserve", reserveRouter);
router.use("/employee", employeeRouter);

module.exports = router;