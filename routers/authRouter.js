const express=require("express")
const router=express.Router()
const { signup,login, refreshToken, loginedUser }=require("../controllers/authController")
const asyncErrorHandler=require("../middlewares/asyncErrorHandler")
const verifyToken = require("../middlewares/verifyToken")

router.post("/signup",asyncErrorHandler(signup))
router.post("/login",asyncErrorHandler(login))
router.post("/refreshToken",asyncErrorHandler(refreshToken))
router.get("/userin",verifyToken, asyncErrorHandler(loginedUser))
module.exports=router