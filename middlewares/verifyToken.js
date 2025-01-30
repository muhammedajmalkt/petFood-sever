const jwt=require("jsonwebtoken")

const verifyToken=(req,res,next)=>{
    const accessToken=req.header("Authorization")?.replace("Bearer " , "");    
    if(!accessToken){
        return res.status(403).json({success:false,message:"token required "})
    }
    
    jwt.verify(accessToken,process.env.JWT_SECRET,(error,decoded)=>{
        if(error){
           return  res.status(403).json({success:false,message:" invalid token or expired"})
        }
        req.user = decoded
        // console.log(decoded);
        next()
        
        
    })
    
}
module.exports=verifyToken
