const { signupSchema, loginSchema } = require("../validations/authValidator");
const User=require("../models/userModel"); 
const { doHash, doHashValidation } = require("../utils/Hashing");
const jwt=require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const { error, value } = signupSchema.validate({ name, email, password });
  // console.log(value,"====value");
  if (error) {
    return res.status(401) .json({ success: false, message: error.details[0].message });
  }
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(401) .json({ success: false, message: "User already Exists" });
  }
  const hashPassword = await doHash(password, 12);

  const newUser = new User({
    name,
    email,
    password: hashPassword,
  })
  const result = await newUser.save();
  result.password = undefined;
  res.status(201).json({ success: true, message: "Your account hasbeen created successfully ", data: result,});

}

          

exports.login=async(req,res)=>{    
    const{email,password}=req.body
    
      const{error}=loginSchema.validate({email,password})
      if(error){
        return res.status(401).json({ success:false,message:error.details[0].message })
      }
      const existingUser=await User.findOne({email})
      if( !existingUser){
        return res.status(401).json({ success:false,message:"Login failed. Please check your credentials" })
      } 
      if(existingUser.isBlocked === true){
        return res.status(401).json({ success:false,message: "Your account has been blocked by admin" })
      }
      const result=await doHashValidation(password,existingUser.password)
      if( !result ){
        return res.status(401).json({sucess:false,message:" Invalid credentials! "})
      }
    //   const token=jwt.sign({
    //     userId:existingUser._id,
    //     email:existingUser.email,
    //     role:existingUser.role
    //   },process.env.JWT_SECRET ,
    //   {  expiresIn:"8h" }
    // )

    const accessToken=generateAccessToken(existingUser)
    const refreshToken=generateRefreshToken(existingUser)

    
    // Send tokens to the client
    res.cookie("refreshToken",refreshToken,{
         httpOnly:true,
         secure:false,
         maxAge:7*24*60*1000,
    })
     existingUser.password=undefined
    res.status(200).json({ success:true,accessToken, message:"Logged is successfully",data:existingUser})
  }
          
    
exports.refreshToken=async(req,res)=>{
  // console.log(req.cookies);
  const refreshToken=req.cookies.refreshToken
  if(!refreshToken){
    res.status(400).json({success:false,message:"Refersh Token is required"})
  }
  try{
     const decoded=jwt.verify( refreshToken , process.env.JWT_REFRESH_SECRET)
     const user= await User.findById(decoded.userId)

     if( !user ){
      return res.status(403).json({message:"Invalid refresh token"})
     }
     const newAccessToken=generateAccessToken(user)
     res.status(200).json({success:true,message:"Token refreshed succesfully",accessToken:newAccessToken})
  }
  catch(error){
       res.status(403).json({message:"Invalid or expired refresh token"})
  }
}

//cr log
exports.loginedUser=async(req,res)=>{
  const userId = req.user.userId
   
  const user= await User.findById(userId).select("-password")
  if(!user){
    return res.status(404).json({success:false,message:"User not found"})
  }
  res.status(200).json({success:true,message:"User data fetched successfully",data:user})
  
}


         
    