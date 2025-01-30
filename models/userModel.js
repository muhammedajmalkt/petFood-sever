const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:[3,"Name must have 3 character"]
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Password must have 6 character"]
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

  userSchema.index({ email:1 })
  
const User = mongoose.model("User",userSchema)
module.exports = User
