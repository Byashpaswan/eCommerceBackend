const jwt=require('jsonwebtoken');
const Response=require('./Response')
const {payloadType}=require('../constants/config')



exports.tokenAuthentication=async(req,res,next)=>{
    try {
        const token=req.headers.authorization || req.query.token ||req.body.token;
        if(token){
            jwt.verify.then(token,process.env.SECREAT_KEY, function(err,result){

                if(err){
                    let response=Response.error();
                    response.payloadType=payloadType.array;
                    response.msg="unauthorized Access";
                    return res.status(403).json(response);
                }

                  next(); 

            })

        


        }
        else{
            let response=Response.error();
            response.payloadType=payloadType.array;
            response.msg=" Token Not Provided";
            return res.status(403).json(response);

        }
    } catch (error) {
        
    }

}