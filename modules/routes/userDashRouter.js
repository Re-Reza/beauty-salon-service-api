const router = require("express").Router();

const authenticateToken = require('../middlewares/authenticateToken'); 
const userDashboard = require(setPath.controllerPath+"/userDashControllers/userDashboard");

//for first option of dashboard
router.get('/userInfo', authenticateToken , userDashboard.extractUserInfo );

//for secod option of dashboard
router.get('/userCurrentReserves', authenticateToken , userDashboard.extracttUserCurrenReserves );
router.get('/userReservesHistory', authenticateToken , userDashboard.extractReservesHistory );
router.delete('/userDeleteReserve/:reserveId', authenticateToken, userDashboard.deleteReserve );

router.put('/changeUserInfo', authenticateToken, userDashboard.changeUserInfo)

router.get('/userMessages', authenticateToken, userDashboard.extractMessages );

router.post('/uploadProfileImage', authenticateToken, userDashboard.uploadProfileImage );
 
module.exports = router;
