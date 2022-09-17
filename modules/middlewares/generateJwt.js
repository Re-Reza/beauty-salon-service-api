const jwt = require("jsonwebtoken");

module.exports = ( userPhoneNumber ) => {
    //set expire date?
    return jwt.sign({ phone : userPhoneNumber }, process.env.JWT_KEY);
}
