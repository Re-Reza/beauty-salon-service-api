const bcrypt = require("bcrypt");

async function hashPassword( password ){
    const hashedPass = await bcrypt.hash(password, 10)
    return hashedPass;
}

function validatePassword( password, hashedPass, callback) {

    bcrypt.compare(password, hashedPass, ( err, result ) =>{
        if(err) throw err;

        callback(result);

    } );
}

module.exports = { 
    hashPassword,
    validatePassword
};