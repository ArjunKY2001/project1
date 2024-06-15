const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
    // id:{},
    name:{
        type:String,
        required:true
    },
    // parentCategoryid:{
    //     type:Schema.Types.ObjectId,
    //     ref:"Category",
    //     required:true,
    //     default:null 
    // },
    isBlocked:{
        type:Boolean,
        required:false,
        default:false
    },
    // offer:{
    //     type:Schema.Types.ObjectId,
    //     ref:"offer"
    // }  
})
module.exports=mongoose.model("Category",categorySchema)