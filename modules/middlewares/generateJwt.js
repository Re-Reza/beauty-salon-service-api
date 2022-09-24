const jwt = require("jsonwebtoken");

module.exports = ( userPhoneNumber, personId, employeeId=null, roleId=null ) => {
    //set expire date? no!
    return jwt.sign({ tokenPhone : userPhoneNumber, tokenPersonId : personId, tokenEmployeeId : employeeId, tokenRoleID : roleId }, process.env.JWT_KEY);
}
