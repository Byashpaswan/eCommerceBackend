const multer=require('multer');
const fs=require('fs');
const { error } = require('console');



const Storage=multer.diskStorage({
        destination:function(req,file,cb){
            let dir="public/uploads/platforms/";
            fs.exists(dir,exist=>{
                if(!exist){
                    return fs.mkdir(dir,{recursive:true},error=>cb(error,dir))
                }
                db(null,dir);
            });
         },
        filename:function(req,file,cb){
          cb(null,file.originalname);

        }
})



const userProfileImageStorage=multer.diskStorage({
    destination:function(req,file,cb){
        let networkId=req.body.networkId;
        const dir="public/uploads/users/"+ networkId;
        fs.exists(dir,exist=>{
            if(!exist){
                return fs.mkdir(dir,{recursive:true},error=>cb(error,dir))
            }
            cb(null,dir);
        })
    },

    filename:function(req,file,cb){
        file.originalname=req.body.email+'.jpg';
        cb(null,file.originalname);

    }
})



const filefilter=function(req,file,cb){
    let fileExist=['jpg','png','gif','jpeg'];
    let name=file.originalname.split(',');
    let isAllowedExt='';
    if(name[0]){
        isAllowedExt=fileExist.includes(name[1].toLowerCase());
    }

    let isAllowedMintype=file.mimetype.startWidth("image/");
    if(isAllowedExt && isAllowedMintype){
        return cb(null,true);  // no error

    }
    else{
    return cb(new error('Only image file are allowed!'),false);
    }

}

const CSVfileFilter = function (req, file, cb) {
    let fileExts = ['csv'];   // Define the allowed extension
    let name = file.originalname.split('.');
    let isAllowedExt = '';
    if (name[1]) {
        isAllowedExt = fileExts.includes(name[1].toLowerCase());  // Check allowed extensions
    }
    let isAllowedMimeType = file.mimetype.startsWith("text/") || file.mimetype.includes("vnd.ms-excel"); // Mime type must be an image
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        return cb(new Error('Only CSV files ( comma seperated format ) are allowed!'), false); // pass error msg to cb, which can be displaye in frontend
    }
};

exports.uploadUserProfileImage=multer({
    storage:userProfileImageStorage,
    fileFilter:filefilter,
    limits:{fileSize:1000000}
})

exports.upload=multer({
    storage:Storage,fileFilter:filefilter,limits:({fileSize:1000000})
})



exports.salt=(length)=>{
    var result='',
    characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    characterLength=characters.length;
    for(var i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characterLength));
    }
    return result;  
}