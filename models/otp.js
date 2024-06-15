const mongoose=require('mongoose')
const otpSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        otp:{
            type:Number,
            required:true
        },
        timestamp:{
            type:Date,
            default:Date.now,
            required:true,
            get:(timestamp)=>timestamp.getTime(),
            set:(timestamp)=>new Date(timestamp),
            expires:90
        }
    }
)
module.exports=mongoose.model("otp",otpSchema)