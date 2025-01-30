const express=require("express")
const router=express.Router()
const { getOrders,addToOrders, verifyPayment }=require("../controllers/orderController")
const asyncErrorHandler=require("../middlewares/asyncErrorHandler")
const verifyToken = require("../middlewares/verifyToken")



router.get("/order/:userId",verifyToken,asyncErrorHandler(getOrders))
router.post("/order/:userId",verifyToken,asyncErrorHandler(addToOrders))
router.post("/order/payment",verifyToken,asyncErrorHandler(verifyPayment))

module.exports=router
