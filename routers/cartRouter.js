const express=require("express")
const router=express.Router()
const {addToCart,increaseQuantity,decreaseQuantty,viewCart,removeFromCart}=require("../controllers/cartController")
const asyncErrorHandler=require("../middlewares/asyncErrorHandler")
const verifyToken = require("../middlewares/verifyToken")


router.post("/cart/:userId",verifyToken, asyncErrorHandler(addToCart))
router.patch("/cart/increase/:userId",asyncErrorHandler(increaseQuantity))
router.patch("/cart/decrease/:userId",asyncErrorHandler(decreaseQuantty))
router.get("/cart/:userId",verifyToken,asyncErrorHandler(viewCart))
router.delete("/cart/:userId",asyncErrorHandler(removeFromCart))

module.exports=router