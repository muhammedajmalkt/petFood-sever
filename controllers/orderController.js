const crypto=require("crypto")
const razorpay = require("../config/rozorpay");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

//getOrderById
exports.getOrders=async(req,res)=>{
    const {userId}=req.params
    // if( !mongoose.Types.ObjectId.isValid(userId)){
    //     return res.status(404).json({success:false,message:"User not valid"})
    // }
    if(!userId){
      return res.status(404).json({success:false,message:"User id not found"})

    }
    const user=await User.findById(userId)  
    console.log(userId);
      
    if(!user){
        return res.status(404).json({success:false,message:"User not found"})
    }
    const order=await Order.find({userId}).populate("products.productId")    
    if(!order){
        return res.status(404).json({success:false,message:"order not valid"})
    }
    res.status(200).json({ success: true,message: `order  successfully`,data: order,});

}

// // addToOrders
// exports.addToOrders=async(req,res)=>{
//     const {userId}=req.params

//     if(!userId){
//         return res.status(404).json({success:false,message:"User id not found"})
//     }
//         const{contact,address}=req.body
      
//         const user= await User.findById(userId)
//         if(!user){
//             return res.status(404).json({success:false,message:"User not found"})

//         }
//         const cart=await Cart.findOne({userId}).populate("items.productId")
//         if(!cart){
//             return res.status(404).json({success:false,message:"cart not found"})

//         }
//         const totalAmount=cart.items.reduce((acc,crv)=> acc + (crv.productId.price * crv.quantity),0)
//     //  console.log(cart.items);
    
//        const newOrder= new Order({
//         userId:userId,
//         products:cart.items.map((item)=>({
//           productId:item.productId,
//           quantity:item.quantity,
//           price:item.productId.price
//        })),
       
//         totalAmount:totalAmount,
//         address:address,
//         contact:contact
       
//     })
//     await newOrder.save()
    
//     return res.status(200).json({success:true,message:"order success",data:newOrder})
// }


exports.addToOrders=async(req,res)=>{
        const {userId}=req.params
        // console.log(req.body);
        
    if (!userId) {
      return res.status(404) .json({ success: false, message: "User id not found" });
    }
    const {  address } = req.body;
    console.log(req.body);
    
    const user = await User.findById(userId);
    if (!user) {
      return res .status(404).json({ success: false, message: "User not found" });
    }
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ success: false, message: "cart not found" });
    }
    const totalAmount=cart.items.reduce((acc,crv)=> acc + (crv.productId.price * crv.quantity),0)

    // Create Razorpay Order
    const option={
        amount:totalAmount * 100,
        currency:"INR",
        receipt:`order_rcpt${Math.ceil(Math.random()*1000)}`
    }
    const razorpayOrder=await razorpay.orders.create(option)
 
       const newOrder= new Order({
        userId:userId,
        products:cart.items.map((item)=>({
          productId:item.productId,
          quantity:item.quantity,
          price:item.productId.price
       })),
       totalAmount:totalAmount,
       address:address,
    //    contact:contact,
       razorpayOrderId:razorpayOrder.id,
       paymentStatus:"pending"
         
    })
console.log(newOrder);

     await newOrder.save()
     cart.items = []
     await cart.save()
     return res.status(200).json({success:true,message:"order created successfully",data:{newOrder,razorpayOrder}})
    }

//paymentVerification    
exports.verifyPayment=async(req,res)=>{
    const {razorpayOrderId,razorpayPaymentId,razorpaySignature}=req.body
    if(!razorpayOrderId || !razorpayPaymentId || !razorpaySignature){
        res.status(400).send("Missing payment detailes")
    }
    
    const generateSignature=crypto
    .createHmac("sha256",process.env.KEY_SECRET)
    .update(`${razorpayOrderId} | ${razorpayPaymentId}`)
    .digest('hex')
    if (generateSignature != razorpaySignature) {
        res.status(400).json({success:false,message:"Inavalid signature"})
    }

    const updateOrder= await Order.findByIdAndUpdate(
        {razorpayOrderId},
        {paymentStatus:"completed"},{razorpayPaymentId},
        {new:true}
    )
    if(!updateOrder){
        return res.status(400).send(" order not found")
    }

    res.status(200).json({success:true,message:" Payment verified and order updated",data:updateOrder})
}

        

