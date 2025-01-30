const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const User = require("../models/userModel")

//getAllUser
exports.getAllUser=async(req,res)=>{
    const { page=1,limit=10}=req.query

    const skip=(page - 1) * limit

    const users= await User.find({role:"user"}).limit(Number(limit)).skip(skip).select("-password")

    const totalUser= await User.countDocuments({role:"user"})
    if(!totalUser){
        return res.status(404).send("No user found")
    }
    res.status(200).json({success:true,data:{users,totalUser}})
} 
                                                                                                                                                   
//getUserById
exports.getUserById=async(req,res)=>{
    const {userId}=req.params
    if(!userId){
        return res.status(404).send(" userId not found ")
    }
    const user= await User.findById(userId).select("-password")
    if(!user){
        return res.status(404).send(" user not found ")
    }
    res.status(200).json({success:true,data:user})

}

//blockUser
exports.blockUser=async(req,res)=>{
    const {userId}=req.params

    const user= await User.findById(userId).select("-password")
    if(!user){
        res.status(404).send("User not found")
    }
    user.isBlocked = !user.isBlocked
    await user.save()
    const message=user.isBlocked === true ?  "Successfully Blocked " : " Successfully Unblocked "
    res.status(200).json({success:true, message:message,data:user})
}

//totalProductPurchased
exports.totalPurchase=async(req,res)=>{
   const totalPurchase= await Order.aggregate([{$unwind:"$products"},{$group:{_id:null,totalPurchase:{$sum:"$products.quantity"}}}])
          // $unwind:   deconstruct the 'prdcts' array into individual documents
   if(totalPurchase === 0 ){
     res.status(400).json({success:false,message: "products not purchased "})
   }
   console.log(totalPurchase);
   
   res.status(200).json({success:true,data:totalPurchase[0].totalPurchase})
}

//totalRevenue
exports.totalRevenue=async(req,res)=>{
    const revenue=await Order.aggregate([{$group:{_id:null,totalIncome:{$sum:"$totalAmount"}}}])
    if (!revenue){
        res.status(404).json({success:false,message:"error on calculation"})
    }
    res.status(200).json({success:true,message:" Successfully calculated Total Revenue",data:revenue[0].totalIncome})
}

//getAllOrders
exports.getAllOrders=async(req,res)=>{
    const{page=1 ,limit=10}=req.query
    const skip=(page - 1 ) * limit
    const totalPurchase=await Order.find({isDelete:false}).skip(skip).limit(Number(limit)).populate("products.productId")
    console.log("order", totalPurchase);
    
     const purchaseCount=await Order.countDocuments()
     res.status(200).json({success:true,data:totalPurchase,TotalPurchase:purchaseCount})
    }
     
     
     