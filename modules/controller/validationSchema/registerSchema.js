const { object, string, ref } = require('yup');

module.exports = object().shape({
    fName : string().required("نام الزامی است").max(250, "نام نمیتواند بیش از ۲۵۰ کاراکتر باشد").trim(),
    lName : string().required("نام خانوادگی الزامی است").max(250, "نام نمیتواند بیش از ۲۵۰ کاراکتر باشد").trim(),
    phone : string().required("شماره تلفن همراه الزامی است").trim(),
    password : string().required("رمز عبور الزامی است").min(4, "رمز عبور باید حداقل شامل ۴ کاراکتر باشد").trim(),
    // confirmPassword : string().oneOf([ ref('password'), null], "رمز عبور و تکرار آن مطابقت ندارد").trim()
});

