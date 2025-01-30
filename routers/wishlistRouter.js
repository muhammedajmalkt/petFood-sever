const express=require("express")
const router=express.Router()
const {addToWishlist,removeWishlist,getWishlist}=require("../controllers/wishlistController")
const asyncErrorhandler = require("../middlewares/asyncErrorHandler")
const verifyToken = require("../middlewares/verifyToken")

router.post("/wishlist/:userId",verifyToken,asyncErrorhandler(addToWishlist))
router.patch("/wishlist/:userId",verifyToken, asyncErrorhandler(removeWishlist))
router.get("/wishlist/:userId",verifyToken,asyncErrorhandler(getWishlist))



module.exports=router