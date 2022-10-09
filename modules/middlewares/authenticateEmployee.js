const Employee = require(setPath.modelsPath+"/Employee");

module.exports = async (req, res, next) => {
    const { tokenEmployeeId, tokenRoleID} = req;
    console.log("in authenticateEmployee");
    const foundEmployee = await Employee.findByPk( tokenEmployeeId, {raw : true} );
    if(foundEmployee && foundEmployee.roleId == tokenRoleID)
    {
        return next();
    }

    res.status(422).json({ 
        success : false,
        error : "خطا در اعتبار سنجی اطلاعات شما خطایی رخ داده لطفا دوباره وارد حساب خود شوید"
    });
}