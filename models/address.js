const mongoose=require('mongoose')
const addressSchema=new mongoose.Schema({
   
    houseName : {
        type : String,
        required : true
    },
    place : {
        type:String,
        required : true
    },
    district : {
        type:String,
        required : true
    },
    pinCode : {
        type:Number,
        required : true
    },
    phone:{
        type:Number,
        required:true
    },
    userEmail : {
        type:String,
        required : true
    },    
    userId:{
        type:String,
        required:true
    }

    
})
module.exports=mongoose.model("Address",addressSchema)