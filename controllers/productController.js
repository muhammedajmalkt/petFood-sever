const { image } = require("../config/cloudinary ");
const Product = require("../models/productModel");
const { productSchema } = require("../validations/productValidator");

//get products
exports.product=async(req,res)=>{
const { page = 1,limit = 12 ,name="",category=""}=req.query

//no.of items to skip
const skip = (page - 1) * limit;    
let filter = {};

  filter = {isDeleted:false}

if (name) {
  filter.name = { $regex: name, $options: "i" };
}
if (category === "all" ? "": category) {
  filter.category = category;
}

const products=await Product.find(filter).skip(skip).limit(Number(limit))

const totalProducts=await Product.countDocuments(filter)
res.status(200).json({
  success: true,
  data: products,
  pagination:{
    total:totalProducts,
    page:Number(page),
    limit:Number(limit),
    totalPages:Math.ceil(totalProducts/limit),
  }
})
}
//get a product by id
exports.productById=async(req,res)=>{
    const {id}=req.params
    const product=await Product.findById(id)

    if( !product ){
        res.status(404).json({success:false,message:"product not found"})
    }
    res.status(200).json({success:true,data:product})
}


// ====admin====
//createProduct
exports.createProduct=async(req,res)=>{
  let {name,image,category,weight,price}=req.body  
  // console.log(value);
  console.log(req.body);
  
  
     image=req.file?.path
    
    const {error,value}=productSchema.validate({name,image,category,weight,price})
    console.log(value);
   if(error){
    return res.status(400).json({success:false,message:error.details[0].message})
  }
    //  if (!req.file) {
    //   return res.status(400).json({ success: false, message: "File is required" });
    // }
    const existingProduct= await Product.findOne({name:name})
  if(existingProduct){
    return res.status(400).json({success:false,message:"Product with the same name already exists."})
  }
  const newProduct= await Product.create(value)

  res.status(200).json({success:true,message:"New product created",data:newProduct})
}


//deleteProduct
exports.deleteProduct=async(req,res)=>{
  const {productId}=req.params
  console.log(productId);
  
  if(!productId){
    return res.status(400).send("ProductId not found" )
  }
  // const deleteProduct=await Product.findByIdAndDelete(productId)
  const deleteProduct=await Product.findByIdAndUpdate(
    {_id: productId},
    {isDeleted:true,deletedDate:Date.now()},
    {new: true}
  )
  if(!deleteProduct){
    return res.status(404).send(" Product not found")
  }
  res.status(200).json({success:true,message:"  Successfully deleted a product",data:deleteProduct})
}

//updateProduct
exports.updateProduct=async(req,res)=>{
  const { productId }=req.params
  let { name,category,image,weight,price}=req.body
           image=req.file?.path
  // if (!req.file) {
  //  return res.status(400).json({ success: false, message: "File is required" });
  // }
  console.log(name,image,category,weight,price );
  
  const updateProduct=await Product.findByIdAndUpdate(
    productId,
    {$set:{ name,image,category,weight,price }},
    {new:true}
  )
  if(!updateProduct){
    res.status(404).send(" Product not found")
  }
  res.status(200).json({success:true,message:"Successfully updated a product",data:updateProduct})
}
