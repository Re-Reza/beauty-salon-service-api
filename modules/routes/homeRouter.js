const router = require('express').Router();

const authenticateToken = require('../middlewares/authenticateToken');
const homeController = require(setPath.controllerPath+"/homeController");

router.get("/provideUserInfo", authenticateToken, homeController.provideUserInfo);
router.get("/provideUserRole", authenticateToken, ( req, res ) => {
    if( !req.tokenRoleID )
        return res.json({
            role : "user",
        })
    else if( req.tokenRoleID == 1)
        return res.json({
            role : "employee",
        })
    else if( req.tokenRoleID == 2)
        return res.json({
            role : "admin",
        })
});

module.exports = router;