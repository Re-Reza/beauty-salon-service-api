const jwt = require("jsonwebtoken");

module.exports = ( userPhoneNumber, personId, employeeId=null, roleId=null ) => {

    //set expire date for admin role 
    if(roleId == 2) {
        console.log("for admin")
        return jwt.sign({ tokenPhone : userPhoneNumber, tokenPersonId : personId, tokenEmployeeId : employeeId, tokenRoleID : roleId }, process.env.JWT_KEY, { expiresIn :"24h"});
    }

    return jwt.sign({ tokenPhone : userPhoneNumber, tokenPersonId : personId, tokenEmployeeId : employeeId, tokenRoleID : roleId }, process.env.JWT_KEY);
}
