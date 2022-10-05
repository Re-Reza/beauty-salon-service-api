const multer = require("multer");

const imageStorage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, "./public/profileImageUploads")
    },
    filename : (req, file, callback) => {
        callback(null, Date.now() +"-"+file.originalname );
    }
})

const profileImageFilter = ( req, file, callback ) =>{

    if( file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" ){
        ///null is for error it means that we have to error
        callback(null, true); //true means acceptable file type
    }
    else{
        callback(new Error("نوع فایل ارسالی مورد پذیرش نمی باشد"));
    }
} 

const profileImgUpload = multer({ 
    storage : imageStorage,
    fileFilter : profileImageFilter,
    // limits : {
    //     fieldSize : 1024*1024 //sutable size for profile image
    // }
});

module.exports = {
    profileImgUpload
};