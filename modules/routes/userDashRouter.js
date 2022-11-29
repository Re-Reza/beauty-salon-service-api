const router = require("express").Router();

const authenticateToken = require('../middlewares/authenticateToken'); 
const userDashboard = require(setPath.controllerPath+"/userDashControllers/userDashboard");
const authenticateEmployee =require("../middlewares/authenticateEmployee");
const profileImgUpload  = require("../middlewares/uploadMiddleware").profileImgUpload.single("profileImage")

//for first option of dashboard
router.get('/userInfo', authenticateToken, userDashboard.extractUserInfo );

//for secod option of dashboard
router.get('/userReserves', authenticateToken , userDashboard.provideRerserveList );
// router.get('/userReservesHistory', authenticateToken , userDashboard.extractReservesHistory );
router.delete('/userDeleteReserve/:reserveId', authenticateToken, userDashboard.deleteReserve );

router.put('/changeUserInfo', authenticateToken, userDashboard.changeUserInfo)

//this route can be use for customers, employees and admin
router.get('/userMessages', authenticateToken, (req, res, next) => {
    if( req.tokenEmployeeId )
        authenticateEmployee(req, res, next);
    else
        next();
}, userDashboard.extractMessages );

router.post("/readMessage", authenticateToken, (req, res, next) => {
    if( req.tokenEmployeeId )
        authenticateEmployee(req, res, next);
    else
        next(); 
}, userDashboard.readMessage );

//delete and update photo by setting query parameter isDelete==1 means delete 
router.post('/uploadProfileImage', authenticateToken, (req, res, next) => {
    
    if(req.query.isDelete == 1) 
    {
        next();
    }
    else{
        profileImgUpload( req, res, function( err ) {
            if(err) {
                console.log(err)
                return res.status(500).json( { 
                    success : false,
                    error : "در بار گزاری فایل خطایی رخ داد است"
                });
            }
            next();
    
        });
    }
}, userDashboard.uploadProfileImage );
 
router.get("/generalInfo", authenticateToken, userDashboard.generalInfo );

router.get("/searhReserveByDate", authenticateToken, userDashboard.searhReserveByDate );

router.delete("/deleteAccount", authenticateToken, userDashboard.deleteAccount );

module.exports = router;