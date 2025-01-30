const Product = require("../models/productModel")
const User = require("../models/userModel")
const WishList = require("../models/wishlist")

//addToWishlist
exports.addToWishlist=async(req,res)=>{
    const{userId}=req.params
    const{productId}=req.body
    
    if(!userId){
       return res.status(404).send("userId not found")
    }
    const user= await User.findById(userId)
    if(!user){
        return res.status(404).send("User not found")
    }
    const product=await Product.findById(productId)
    if(!product){
        return res.status(404).send("product  not found")
    }
    let createWishlist=await WishList.findOne({userId})

    if(!createWishlist){
         createWishlist= new WishList({
            userId,
            products:[]
         })
    }
        const existProduct= createWishlist.products.find((item) => item.productId.toString() === productId)
        console.log(existProduct);
        
        if(existProduct){
            return res.status(400).json({success:false,message:"product already exist"})
        }
        
        createWishlist.products.push({productId})

    
    await createWishlist.save()
     return res.status(200).json({success:true,message:"product added to wishlist",data:createWishlist})

}

//removeProductFromWishlist
exports.removeWishlist=async(req,res)=>{
     const { userId}=req.params
     const {productId}=req.body
     if(!userId){
        return res.status(404).send("userId not found")
    }
    const user= await User.findById(userId)
    if(!user){
        return res.status(404).send("user not found")
    }
    const removeProduct=await WishList.updateOne(
    {userId:userId},
    {$pull: {products:{productId:productId}  }},
    {new :true}
 )
  return  res.status(200).json({success:true,message:"product remove from wishlist",data:removeProduct})
}

//showWishlist
exports.getWishlist=async(req,res)=>{
    const {userId}=req.params
    if(!userId){
        return res.status(404).send("userId not found")
    }
    const user =await User.findById(userId)
    if(!user){
        return res.status(404).send("user not found")
    }
    const wishlist=await WishList.findOne({userId}).populate("products.productId")
    if(!wishlist){
        return res.status(404).json({success:false,message:"wishlist not found"})
    }

    return res.status(200).json({success:true,data:wishlist})

}