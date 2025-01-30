const express=require("express")
const router=express.Router()
const {getAllUser,getUserById, getAllOrders, totalRevenue, totalPurchase, blockUser}=require("../controllers/adminControllers")
const asyncErrorhandler = require("../middlewares/asyncErrorHandler")
const isAdmin = require("../middlewares/adminToken")
const verifyToken = require("../middlewares/verifyToken")

router.get("/users",verifyToken, isAdmin,asyncErrorhandler(getAllUser))
router.get("/user/:userId",verifyToken,isAdmin,asyncErrorhandler(getUserById))
router.patch("/user/:userId",verifyToken,isAdmin,asyncErrorhandler(blockUser))

router.get("/purchase",verifyToken,isAdmin,asyncErrorhandler(totalPurchase))
router.get("/income",verifyToken,isAdmin,asyncErrorhandler(totalRevenue))
router.get("/orders",verifyToken,isAdmin,asyncErrorhandler(getAllOrders))


module.exports=router



