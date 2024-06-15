const Cart=require('../../models/cart')
const Product=require('../../models/product')
const User=require('../../models/userModels')
const Category = require("../../models/category")

const loadProduct=async(req,res)=>{
    try {

        const prd=req.query.prctId
        const usr=req.query.userId
        const prdDtls=await Product.findById(prd)
        const user=await User.findById(usr)
        const cart=await Cart.findOne({userId:usr}).populate('items.product')
       
        // console.log(cart);
        let alertMessage=false
        // console.log("productlist session check  ",req.session.user_id);
        return res.render('productDetails',{product:prdDtls,user,cart,alertMessage})
        
    } catch (error) {
        console.log(error.message);
        
    }
}
const loadHome = async(req,res)=>{
    try{
        const usr=req.session.user_id
        const userData = await  User.findById({_id:usr[0]._id})
        const product=await Product.find({isActive:true})
        const carts=await Cart.findOne({userId:usr[0]._id})
        const category=await Category.find({})
        
        return  res.render('productList',{product:product,user:userData,carts,Category:category})
    }catch(error){
        console.log(error.message);
    }
}
const sortItems=async(req,res)=>{
    try {
        console.log(" hello ",req.session.user_id);
        const usr = req.session.user_id
        const userData = await  User.findById({_id:usr[0]._id})
        const carts=await Cart.findOne({userId:usr[0]._id})
        const category=await Category.find({})
        const product=await Product.find({isActive:true})
        const selectedOption = req.query.selectedOption
        console.log(" sorted ",selectedOption);
        if(selectedOption == 'ascending'){
            const product = await Product.find({isActive:true}).sort({price:1})
            return res.render('productList',{user:userData,product:product,carts,Category:category})
        }else if(selectedOption == 'descending'){
            const product = await Product.find({isActive:true}).sort({price:-1})
            return res.render('productList',{user:userData,product:product,carts,Category:category})
        }else {
            return res.render('productList',{user:userData,product:product,carts,Category:category})
        }
    } catch (error) {
        console.log(error.message);
    }

}
const searchTerm=async(req,res)=>{
    try {
        const usr=req.session.user_id
        const userData = await  User.findById({_id:usr[0]._id})
        const product=await Product.find({isActive:true})
        const carts=await Cart.findOne({userId:usr[0]._id})
        const category=await Category.find({})

        if(req.body.searchTerm){
            const term=req.body.searchTerm
            const product = await Product.find({
                isActive: true,
                name: { $regex: new RegExp(term, 'i') } // Case-insensitive search for the term in product names
            });
            return  res.render('productList',{product:product,user:userData,carts,Category:category})
        }else{
            console.log("reached here ");
            return  res.render('productList',{product:product,user:userData,carts,Category:category})
        }
        
    } catch (error) {
        console.log(error.message)
    }
}
const searchCategory=async(req,res)=>{
    try {
            const cat=req.query.filterditems
            console.log(" nio ",cat);
            const user = req.session.user_id
            const userData = await  User.findById({_id:user[0]._id})
            const catgry=await Category.find({})
            const catid=await Category.findOne({isBlocked:false},{name:cat})
            console.log(" heythit ",catid);
            const productid=await Product.find({isActive:true,category:catid._id})
            const product=await Product.find({_id:productid._id})
            const carts=await Cart.findOne({userId:user[0]._id})
            console.log(" asada ",product," nio ",catid._id);
            return res.render('productList',{product:productid,user:userData,carts,Category:catgry})

    } catch (error) {
        console.log(error.message);
    }
}
const again=async(req,res)=>{
    try {
        const user=req.query.userid
        const usr=await User.findById({user})
        const product=await Product.find({isActive:true})
           
        return res.render('productList',{product:product,user:usr})
    } catch (error) {
        console.log(error.message)
    }

}
module.exports={
    loadProduct,
    loadHome,
    sortItems,
    searchTerm,
    searchCategory,
    again
}
