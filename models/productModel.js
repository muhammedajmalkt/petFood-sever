const { types } = require("joi")
const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    image:{
        type:String,
        // required:true
    },
    name:{
        type:String,
        required:true
    },   
    category:{
        type:String,
        enum:["dog","cat"],
        required:true
    },
    weight:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        default:5
    },
    description:{
        type:String,
        // minlength:[10,"Description at least 10 caracters"],
        maxlength:500,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedDate:{
        type:Date,
        default:null
    }

},{timestamps:true} 
)

//compound index on `name` and `category`
  productSchema.index({name: 1, category : 1},{ unique: true}) 
  productSchema.index({ name: 1 });
  productSchema.index({ category: 1 });

const Product = mongoose.model("Product",productSchema)
module.exports = Product