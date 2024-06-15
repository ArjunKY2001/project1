
 const mongoose=require("mongoose")
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    category:{
        type:String,
       required: true
   },
    price:{
        type:Number,
        required: true
    },
    
    stock:{
        type:Number,
        required: true
    },
    isActive:{
        type:Boolean,
        default:true
    }
    //isoffer:{
        //type: Schema.Types.ObjectId,
      //  ref: "Offer",
    //},
    // {timestamp:true}
})
module.exports=mongoose.model('product',productSchema)