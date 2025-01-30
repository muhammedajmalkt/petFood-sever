const Razorpay = require("razorpay")

// create razorpay instance 
const razorpay= new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
})

module.exports=razorpay