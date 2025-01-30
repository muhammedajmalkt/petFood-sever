const { required } = require("joi");
const mongoose=require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      houseName: { type: String, required: true },
      city: { type: String, required: true },
      pin: { type: Number, required: true },
      state: { type: String, required: true },
      contact: {type: Number,  min: 10,required :true}
    },
    
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    razorpayOrderId: {
        type: String,           // Store the Razorpay order Id
    },      
    razorpayPaymentId: {
      type: String,             // Store the Razorpay payment Id
    },
    isDelete:{
        type:Boolean,
        default:false,
    }
  
},{ timestamps: true }
);

orderSchema.index({ userId: 1 });
// orderSchema.index({ orderStatus: 1 });
// orderSchema.index({ razorpayOrderId: 1 });

const Order=mongoose.model("Order" ,orderSchema)
module.exports=Order

    
    
    
    
    