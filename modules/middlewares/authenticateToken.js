const jwt = require("jsonwebtoken");

module.exports = ( req, res, next) => {

    const token = req.query.token;
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
            req.phone = decoded;
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