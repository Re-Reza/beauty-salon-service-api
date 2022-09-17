const { Router } = require('express');
const router = new Router();

const loginRegister = require("./login_register");
const adminRouter = require("./adminRouter");

router.use( loginRegister);
router.use("/admin", adminRouter);


module.exports = router;