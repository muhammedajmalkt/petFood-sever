const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
require('dotenv').config()
const authRouter=require("./routers/authRouter")
const productRouter=require("./routers/productRouter")
const cartRouter=require("./routers/cartRouter")
const orderRouter=require("./routers/orderRouter")
const wishlistRouter=require("./routers/wishlistRouter")
const adminRouter=require("./routers/adminRouter")
const errorHandler = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")

const app=express()
app.use(express.json())
// app.use(express.urlencoded({extended:true}))

const option={
    origin: "https://petfood-jzut.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    credentials: true,
}
app.use(cookieParser())
app.use(cors(option))

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database Connected")
})
.catch((err)=>{
    console.log(err)
})
    
    
app.use("/api/users",authRouter)
app.use("/api",productRouter)
app.use("/api/users",cartRouter)
app.use("/api/users",orderRouter)
app.use("/api/users",wishlistRouter)

app.use("/api/admin",adminRouter)

app.use(errorHandler) 


app.listen(process.env.PORT,()=>{
console.log("server"); 
})
    