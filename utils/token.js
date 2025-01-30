const jwt=require('jsonwebtoken')


const generateAccessToken=(user)=>{
 return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role
    },process.env.JWT_SECRET,
    {expiresIn:"8h"}
)
}

const generateRefreshToken=(user)=>{
    return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role
    },process.env.JWT_REFRESH_SECRET,
    {expiresIn: "7d"}
)
}
module.exports={generateAccessToken,generateRefreshToken}