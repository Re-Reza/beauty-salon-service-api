const jwt = require("jsonwebtoken");

module.exports = ( req, res, next) => {

    const token = req.query.token || req.body.token;
    console.log(req.query)
    if( token ){
        jwt.verify( token, process.env.JWT_KEY, (err, decoded) => {
            
            if(err) {
                console.log(err);
                return res.status(401).json({
                    success : false,
                    error : "در اعتبار سنجی خطایی رخ داده است"
                });
            }

            const { tokenPhone, tokenPersonId} = decoded;
            req.tokenPhone = tokenPhone;
            req.tokenPersonId = tokenPersonId;
            if( decoded.tokenEmployeeId ){
                req.tokenEmployeeId = decoded.tokenEmployeeId;
                req.tokenRoleID = decoded.tokenRoleID;
            }
            console.log("successfully token was authenticated");
            console.log(decoded);
            next();
        });
    }
    else { 
        return res.status(401).json({
            success : false,
            error : "لطفا وارد حساب کاربری خود شوید"
        });
    }
}