
const mongoose=require("mongoose")

const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[{
        productId:{ type: mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
        quantity:{type: Number,default:1,required:true}
    }]
},
 {timestamps:true}
)

cartSchema.index({userId:1})
cartSchema.index({"items.productId":1})

const Cart=mongoose.model("Cart",cartSchema)
module.exports=Cart