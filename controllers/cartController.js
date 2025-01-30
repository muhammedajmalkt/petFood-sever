const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
const User = require("../models/userModel")


//add product to cart
exports.addToCart=async (req,res)=>{
   const  {userId}=req.params
    const {productId,quantity}=req.body
    
    if(!userId){
      return res.status(404).json({success:false,message:"User Id not found"})
    }

    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({success:false,message:"User not found"})
    }     
    
     //product Exist
     const product=await Product.findById(productId)
    if(!product) {
        return res.status(404).json({success:false,message:"product not found"})
    }
    let cart=await Cart.findOne({userId})
    if(!cart){
        cart=new Cart({userId ,items:[]})
    }
    //check-item-cart 
    const existingItem=cart.items.find(item => item.productId.toString() === productId)
    if(existingItem){
        existingItem.quantity += quantity
    }else{
        cart.items.push({productId,quantity})
    }
    await cart.save()
    res.status(200).json({success:true,data:cart})
}



//increaseQuanty
exports.increaseQuantity=async(req,res)=>{
    const {userId}=req.params
    const {productId}=req.body
   
    if(!userId){
        return res.status(404).json({success:false,message:"User Id not found"})
    }

    const cart=await Cart.findOne({userId})
    if(!cart)return res.status(404).json({success:false,message:"Cart not found"})

    const item =   cart.items.find(item => item.productId.toString() === productId)
    if (!item) return res.status(404).json({ success: false, message: "Product not found in cart" });

     const stock= await Product.findById(productId)
     if(item.quantity < stock.stock){
         item.quantity += 1
         await cart.save()
     }else{
        res.status(400).json({ success: false,message: "Insufficient stock" });
     }
// console.log(cart.items);

   res.status(200).json({ success: true, data: cart });
}


//decreaseQuantty
exports.decreaseQuantty=async(req,res)=>{
    const {productId}=req.body
    const {userId}=req.params

    if(!userId){
        return res.status(404).json({success:false,message:"User Id not found"})
    }
    const cart=await Cart.findOne({userId})
    if(!cart)return res.status(404).json({success:false,message:"Cart not found"})

    const item =   cart.items.find(item => item.productId.toString() === productId)
    if (!item) return res.status(404).json({ success: false, message: "Product not found in cart" });
    
    if(item.quantity > 1){
        
        item.quantity -=1
    }
     await cart.save()
     res.status(200).json({ success: true, data: cart });


    
}

//view cart
exports.viewCart=async (req,res)=>{
    const {userId}=req.params
    const cart=await Cart.findOne({userId:userId}).populate("items.productId")
    if(!cart){
        return res.status(404).send({success:false,message:"Cart not found"})
    }
    const totalAmount= cart.items.reduce((acc,crv)=> acc+  crv.quantity * crv.productId.price,0)
    
    res.status(200).json({success:true,data:{cart,totalAmount}})
}

//removeItemFromCart
exports.removeFromCart=async(req,res)=>{
    console.log(req.body);
    console.log(req.params);
    
    const {userId}=req.params
    const {productId}=req.body    
    let cart=await Cart.findOne({userId:userId})
    if(!cart){
        return res.status(404).json({success:false,message:"Cart not found"})
    }
    cart.items=cart.items.filter( item => item.productId.toString() !== productId)

    await cart.save()
    res.status(200).json({success:true,data:cart})
}

// //clearCart
// exports.clearCart=async(req,res)=>{
//     const{userId}=req.body

//     const cart=await Cart.findOne({userId})
//     if(!cart)return res.status(404).json({success:false,message:"Cart not found"})

//     cart.items=[]
//     await cart.save()
//     res.status(200).json({ success: true, message: "Cart cleared successfully" })

// }
    
    

    