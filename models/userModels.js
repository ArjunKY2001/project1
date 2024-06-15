const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        default:0
    },
    is_varified:{
        type:Number,
       default:0
    },
    is_active:{
        type:Boolean,
        required:true,
        default:true
    }
})

module.exports=mongoose.model("User",userSchema)