const express=require("express")
const router=express.Router()
const {product,productById, createProduct, deleteProduct, updateProduct}=require("../controllers/productController")
const asyncErrorhandler = require("../middlewares/asyncErrorHandler")
const verifyToken = require("../middlewares/verifyToken")
const isAdmin = require("../middlewares/adminToken")
const upload = require("../middlewares/uploadMiddleware")

router.get("/products",asyncErrorhandler(product))
router.get("/products/:id",asyncErrorhandler(productById))

//admin
router.get("/admin/products",asyncErrorhandler(product))
router.post("/products",verifyToken,isAdmin,upload.single("image"),asyncErrorhandler(createProduct))
router.patch("/products/:productId",verifyToken,isAdmin,asyncErrorhandler(deleteProduct))
router.put("/products/:productId",verifyToken,isAdmin,upload.single("image"),asyncErrorhandler(updateProduct))

module.exports=router