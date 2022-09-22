const jwt = require("jsonwebtoken");

module.exports = ( userPhoneNumber, personId ) => {
    //set expire date? no!
    return jwt.sign({ tokenPhone : userPhoneNumber, tokenPersonId : personId }, process.env.JWT_KEY);
}
