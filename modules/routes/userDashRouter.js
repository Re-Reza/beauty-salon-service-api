const router = require("express").Router();

const authenticateToken = require('../middlewares/authenticateToken'); 
const userDashboard = require(setPath.controllerPath+"/userDashControllers/userDashboard");

//for first option of dashboard
router.get('/userInfo', authenticateToken , userDashboard.extractUserInfo );

//for secod option of dashboard
router.get('/userCurrentReserves', authenticateToken , userDashboard.extractCurrentUserReserves );



module.exports = router;
