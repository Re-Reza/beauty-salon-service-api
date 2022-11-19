const  moment = require("jalali-moment");

module.exports = function() {
    moment.locale("fa", { useGregorianParser : true} );
    return moment().format("YYYY/MM/DD HH:mm:ss");
}