const jwt = require("jsonwebtoken");

module.exports = ( req, res, next) => {

    const token = req.query.token || req.body.token;
    if( token ){
        jwt.verify( token, process.env.JWT_KEY, (err, decoded) => {
            if(err) {
                console.log(err);
                return res.status(401).json({
                    success : false,
                    error : "در اعتبار سنجی خطایی رخ داده است"
                })
            }

            console.log(decoded);
            const { tokenPhone, tokenPersonId} = decoded;
            req.tokenPhone = tokenPhone;
            req.tokenPersonId = tokenPersonId;
            console.log("successfully token was authenticated");
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