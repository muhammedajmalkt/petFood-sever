const { required } = require("joi")
const mongoose=require("mongoose")

const wishlistSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    products:[{
       productId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
       }
    }]
})

wishlistSchema.index({userId:1})
wishlistSchema.index({ userId: 1, "products.productId": 1 }, { unique: true });
 
const WishList=mongoose.model("WishList",wishlistSchema)
module.exports=WishList