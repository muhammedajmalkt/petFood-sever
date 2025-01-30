const errorHandler = (error,req,res,next)=>{
// console.log(error);

    let statusCode = error.statusCode || 500
    let message    = error.message || "Internal server error"
     
    res.status(statusCode).json({success:false,message})
}
module.exports=errorHandler