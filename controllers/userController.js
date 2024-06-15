const User=require('../models/userModels')
const bcrypt=require('bcrypt')
const otpGenerator = require('otp-generator')
const Otp=require('../models/otp')
const Product=require('../models/product')
const Category = require("../models/category")
const Address=require('../models/address')
const Cart=require('../models/cart')
const Order=require('../models/order')


const nodemailer=require('nodemailer')
// const { render } = require('../routes/userRoute')
// const Mailgen=require('mailgen')
// const {EMAIL,PASSWORD}=require('../env.js')


const securePassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash
    }catch(error){
        console.log(error.message);
    }
}
const loadRegister=async(req,res)=>{
    try{
        //res.render("emailotp")
        return res.render("userRegister")
    }catch(error ){
        console.log(error.message);
    }
}
const loadpage=async(req,res)=>{
    try {
        return res.render('index')
    } catch (error) {  
        console.log(error.message);
    }
}
const OTP=async(req,res)=>{
   try {
    const {username,email,password,mobile}=req.body;
    console.log(" rolex  ",password);
   const spassword=securePassword(password)
   req.session.userDetails = {username,email,password,mobile};
   const otpValue=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
   
   let result = await Otp.findOne({ otpValue });
   while (result) {
       otpValue = otpGenerator.generate(6,{
           upperCaseAlphabets: false,
           lowerCaseAlphabets: false,
           specialChars: false,
       });
       result = await Otp.findOne({ otpValue });
   }
   let otp = otpValue;
   
   const otpPayload = { email, otp };
   const otpBody = await Otp.create(otpPayload);
  // console.log("msil snd otp",otpBody);

  
   await sendMail(email,"verification email",`${otpValue}`)
   return res.render('emailotp')
   
    
   } catch (error) {
    console.log(error.message);
   }
}   
const verifyOtp=async(req,res)=>{    
    try {
           
    const {username,email,mobile,password}= req.session.userDetails
    const response=await Otp.findOne({email:email}).sort({timestamp:-1})
    
    const enteredOTP = req.body.otp.trim()
   
    if (!response) {
        return res.status(400).send("OTP not found for the provided email.");
    }
    const reyr="cvsfggggr"
    //console.log("u entered ",enteredOTP,"/ the actuall ",response.otp);

    const west=response.otp
    const hif=west.toString()
    //console.log('dey',hif);
    
    if (enteredOTP == hif) {
        const user=new User({
            name:username,
            email,
            password,
            mobile,
            address1:reyr
        })
        await user.save();
        return  res.redirect('/user/home')
    } else {
        return  res.render("notFound")
    }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error")
    }

}
const resendOtp=async(req,res)=>{
    try {
    
    const email = req.session.userDetails.email
    console.log(email);
        let otpValue=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
   
        let result = await Otp.findOneAndUpdate({ email }, { otpValue }, { upsert: true });
        while (result) {
            otpValue = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await Otp.findOne({ otpValue });
        }
        let otp = otpValue;
        
       
        const otpPayload = { email, otp };
        const otpBody = await Otp.create(otpPayload);
        console.log("msil snd otp",otpBody);
     
       
        await sendMail(email,"verification email",`${otpValue}`)
      //  res.render('emailotp',{ message: "OTP sent "})
      return  res.redirect('/user/verifyresendOtp')
        

    
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
const verifyresendOtp=async(req,res)=>{
        try {
           
             const {username,email,mobile,password}= req.session.userDetails
            const response=await Otp.findOne({email:email})
            
            const enteredOTP = req.body.otp.trim()
           
            console.log("response.otp : ",response.otp);
            console.log("enteredOTP : ",enteredOTP);
            
            if (!response) {
                return res.status(400).send("OTP not found for the provided email.");
            }
            
            if (enteredOTP == response.otp) {
                const user=new User({
                    name:username,
                    email,
                    password,
                    mobile
                })
                await user.save();
                return res.redirect('/user/home')
            } else {
                return  res.render("notFound")
            }
            } catch (error) {
                console.log(error.message);
                return  res.status(500).send("Internal server error")
     }
}
const sendMail=async (email,title,body)=>{
    try {
        let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'mhdrizwanpkd@gmail.com',
    
            pass:'sgzmnhpoginjuwat'
            
        }
    })
    let mailOptions =await transporter.sendMail({
    from:'mhdrizwanpkd@gmail.com',
    to:`${email}`,
    subject:`${title}`,
    text:`${body}`
    })
    console.log("otp send successfully",mailOptions);
    } catch (error) {
        console.log(error.message)
    }   
}
const loginLoad=async(req,res)=>{
    try {
       // console.log("kloi  ",req.session.user_not_found," n ",req.session.passworderror);
    //return res.render("index")
    const userNotfound=req.session.user_not_found
    const passwordNotfound=req.session.passworderror
    // res.redirect('/user/login')
    //console.log(userNotfound);
    if(userNotfound){
       delete req.session.user_not_found
       return  res.render("useraccountlogin",{message1:"Email is incorrect"})
    }else if(passwordNotfound){
        delete req.session.passwordNotfound
        return res.render("useraccountlogin",{message2:'Password is incorrect'})
    }
     return res.render("useraccountlogin")
    }catch(error){
       console.log(error.message)
    }
}
const verifyLogin = async(req,res)=>{
    try {
        const email=req.body.email
        const password = req.body.password
        const userData = await User.findOne({email:email})
        //console.log(userData)
        if(userData){
        if (password !== userData.password) {
            console.log("userData.password  ",userData.password)
            req.session.passworderror=true
            return res.redirect('/user/login')
        } else {
            req.session.user = req.body.email
            req.session.isLoggedUser = true;
            const category=await Category.find({})
            const product=await Product.find({isActive:true})
            const userActive=await User.find({email:req.body.email,is_active:true})
            if(userActive){
                req.session.user_id=userActive
                const carts=await Cart.findOne({userId:req.session.user_id[0]._id})
                //console.log("category.length  ",category[2].name);
               return res.redirect("/user/home")
            }
        }}else{
            console.log("user not found");
            req.session.user_not_found=true
            return res.redirect('/user/login')
        }       
        }catch(error){
        console.log(error)
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
const orderTrack=async(req,res)=>{
    try {
        return res.render('orderTracking') 
    } catch (error) {
        console.log(error.message);
    }
}
const orderlist=async(req,res)=>{
    try {
        const usr=req.session.user_id[0]._id
        let page=1
        if(req.query.page){
            page=req.query.page
        }
        const limit=7
        const order=await Order.find({userId:usr}).sort({date:-1}).limit(limit*1).skip((page-1)*limit).exec()
        const ordr=await Order.find({userId:usr})
        const count=ordr.length
        const totalpage= Math.ceil(count/limit)
        return res.render("orderlist",{order,totalpage})
    } catch (error) {
        console.log(error.message);
        
    }
}
const loadProfile=async(req,res)=>{
    try {
        const usr = req.query.usrId ? req.query.usrId : req.session.user_id;
        const address=await Address.find({userId:usr})
        //console.log(address);
        const user=await User.find({_id:usr})
        const order=await Order.find({userId:usr}).sort({date:-1}).limit(5)
        // console.log("giro ", check);
        

        return res.render('userProfile',{user,address,order})
        
    } catch (error) {
        console.log(error.message)
    }
}
const loadeditProfile=async(req,res)=>{
    try {
       // const usrid=req.body.id
       const usr=req.query.usrid
        
        const usrd=await User.findOne({_id:usr})
        //console.log("bru ",usrd)
        return res.render("editProfile",{user:usrd})

    } catch (error) {
        console.log(error.message)
    }
}
const editProfile=async(req,res)=>{
    try {
        const usr=req.body.id
        const nam=req.body.Name
        const eml=req.body.email
        const mbl=req.body.mobile
        
        await User.findOneAndUpdate({_id:usr},
            {
                name:nam,
                email:eml,
                mobile:mbl
            })
            return res.redirect("/user/profile")


    } catch (error) {
        console.log(error.message)
    }
}
const loadaddAddress=async(req,res)=>{
    try {
        const usadrs=req.query.usad||req.session.user_id[0]._id
        //console.log("hey",req.session.user_id[0]._id);
        const client=await User.findOne({_id:usadrs})
        //console.log("ellora",client);
        // const test=req.query.usad
        // let look=false
        // if(test){
        //    look=true
        // }
        // console.log("check it ",look);
        return res.render('addAddress',{user:client})
    } catch (error) {
        console.log(error.message)
    }
}
const addAddress=async(req,res)=>{
    try {
        const usr=req.session.user_id
        const user=await User.find({_id:usr[0]._id})
       // console.log("khoii",user[0]._id);

        const hsName=req.body.houseName
        const plc=req.body.place
        const dist=req.body.district
        const pnCd=req.body.pinCode
        const phn=req.body.phone
        const eml=req.body.email
        

        
        const address=new Address({
            houseName:hsName,
            place:plc,
            district :dist,
            pinCode :pnCd,
            phone:phn,
            userEmail :eml,
             userId:user[0].id
        })

        await address.save()
        
        const check=await Address.findOne({houseName:hsName})
        
        // console.log("check itout ",check);
        if(check){
            return res.redirect("/user/profile")
        }else{
            return res.redirect('/user/loadcheckout')
        }
    } catch (error) {
        console.log(error.message) 
    }
}
const loadeditAddress=async(req,res)=>{
    try {
        const adrsid=req.query.adrsid
        //console.log("editaddress ",adrsid);
        
        const adres=await Address.findOne({_id:adrsid})
        //console.log('omg',adres);
        return res.render('editAddress',{address:adres})
        
    } catch (error) {
        console.log(error.message) 
    }
}
const editAddress=async(req,res)=>{
    try {
        const usr=req.session.user_id
        const user=await User.find({_id:usr[0]._id})
        const hsName=req.body.houseName
        const plc=req.body.place
        const dist=req.body.district
        const pnCd=req.body.pinCode
        const phn=req.body.phone
        const eml=req.body.email
        const adis=req.body.id

        await Address.findOneAndUpdate({_id:adis},
            {$set:{houseName:hsName,
                place:plc,
                district :dist,
                pinCode :pnCd,
                phone:phn,
                userEmail :eml,
                 userId:user[0].id
        }})
        return res.redirect("/user/profile")
    } catch (error) {
        console.log(error.message) 
    }
}
const deleteAddress =async(req,res)=>{
    try {
        const adrid=req.query.adrsid
        console.log(adrid);
        await Address.deleteOne({_id:adrid})
        const usr = req.query.usrId ? req.query.usrId : req.session.user_id;
        const address=await Address.find({userId:usr})
        const user=await User.find({_id:usr})
        const order=await Order.find({userId:usr})
        return res.render('userProfile',{user,address,order})

    } catch (error) {
        console.log(error.message)
    }
}
const  loadcart=async(req,res)=>{
    try {
        const user =req.session.user_id
      console.log("haichello");
        //const prid=req.body.prdid
        const cart=await Cart.findOne({userId:user[0]._id}).populate("items.product")
       // console.log(" griu",cart.items.product.name);
       return res.render('cartPage',{cart})
    } catch (error) {
        console.log(error.message)
    }
}
const addcart = async (req, res) => {
    try {
        const prdct = req.body.prdid;
        const usr = req.body.userid;
        const product = await Product.findById(prdct);
        const price = product.price;
        const quantity = 1;
        const total=price*quantity
        //console.log("totall ");
        if(product.isActive===true && product.stock>0){
        let userCart = await Cart.findOne({ userId: usr });

        if (!userCart) {
            userCart = new Cart({ userId: usr, items: [], totalPrice: 0 })
        }
        
        const existingItemIndex = userCart.items.findIndex(item => item.product.toString() === prdct);
        // console.log(" goiy ",existingItemIndex);
        if (existingItemIndex !== -1) {
            userCart.items[existingItemIndex].quantity += quantity;
        } else {
            userCart.items.push({ product: prdct, price: price, quantity: quantity ,subtotal:total});
            userCart.totalPrice += price * quantity;
        }

        // Save the user's cart
        await userCart.save();
        // Find the user's cart again to populate items array
        const cart=await Cart.findOne({userId: usr}).populate("items.product")
        //console.log(" griu",cart);
        // res.render('cartPage',{cart})
        return res.redirect("/user/loadcart")
       
        }else{
            const prdDtls=await Product.findById(prdct)
            const user=await User.findById(usr)
            const cart=await Cart.findOne({userId:usr}).populate('items.product')
            if(product.isActive===false){
                let alertMessage="This product is unlisted"
                return res.render('productDetails',{product:prdDtls,user,cart,alertMessage})
            }else{
            let alertMessage="This product is out of stock"
            return  res.render('productDetails',{product:prdDtls,user,cart,alertMessage})
            }
           //res.redirect('/user/home') 
        }
    } catch (error) {
        console.log(error.message);
        // Throw the error to handle it in the calling function
        throw error;
    }
}
const trash=async(req,res)=>{
    try {
        const itemId = req.query.itemId;
        //console.log("hey ramm  ",req.session.user_id);
        // Your code to delete the item from the database
        const usr=req.session.user_id[0]._id
        //console.log("hey ramm  ",usr);
        const carts=await Cart.findOne({ userId: usr })
        const subtotalToRemove=carts.items.find(item => item._id.toString() === itemId).subtotal
        // console.log("hey ramm ",subtotalToRemove);
        await Cart.findOneAndUpdate(
            { userId:usr},
            { $pull: { items: { _id: itemId } } }
        );

        const totalPrice = carts.totalPrice - subtotalToRemove;
        // console.log(totalPrice);

        // Update the cart's totalPrice
        await Cart.findOneAndUpdate(
          { userId: usr },
          { $set: { totalPrice: totalPrice } }
            );

        const cart=await Cart.findOne({userId:usr}).populate("items.product")
        // console.log(" griu",cart);
        return res.render('cartPage',{cart})
        //res.redirect("/admin/loadcart")
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.sendStatus(500);
    }
}
const quantityIncrease = async(req,res)=>{
    try {
        console.log("increase");
        const userData = req.session.user_id
        const indexOfItems = req.query.index
        const user = await User.findOne({email:userData[0].email})
        const cart = await Cart.findOne({userId:user._id})
        const product = await Product.findOne({_id:cart.items[indexOfItems].product})
        
        if(product.stock>=cart.items[indexOfItems].quantity){
            cart.items[indexOfItems].quantity++
        }
        cart.items[indexOfItems].subtotal=cart.items[indexOfItems].price*cart.items[indexOfItems].quantity

        let totalPrice = 0
        for(i=0;i<cart.items.length;i++){
            totalPrice += cart.items[i].price*cart.items[i].quantity
        }
        cart.totalPrice = totalPrice
        await cart.save()
        return res.json({cart,index:indexOfItems})

        // product.stock--
        // await product.save()
        // res.redirect("/user/loadcart")
    } catch (error) {
        console.error(error);
    }
}
const quantityDecrease = async(req,res)=>{
    try {
        console.log("erekio ");
        const userData = req.session.user
        const indexOfItems = req.query.index
        const user = await User.findOne({email:userData})
        const cart = await Cart.findOne({userId:user._id})
        const product = await Product.findOne({_id:cart.items[indexOfItems].product})
        cart.items[indexOfItems].quantity--
        cart.items[indexOfItems].subtotal=cart.items[indexOfItems].price*cart.items[indexOfItems].quantity


        let totalPrice = 0
        for(i=0;i<cart.items.length;i++){
            totalPrice += cart.items[i].price*cart.items[i].quantity
        }
        cart.totalPrice = totalPrice
        await cart.save()

        // product.stock++
        // await product.save()
        // res.redirect("/user/loadcart")
        return res.json(cart)
    } catch (error) {
        console.error(error);
    }
}
const loadcheckout=async(req,res)=>{
    try {
        const usid=req.session.user_id
        const crt=await Cart.findOne({userId:usid[0]._id}).populate("items.product")
        const adrs=await Address.find({userId:usid[0]._id})
       //console.log("hey prabuu ",crt," joi ",adrs.length)
       return res.render("checkout",{cart:crt,address:adrs})
    } catch (error) {
        console.log(error);
    }
}
const loadinvoice=async(req,res)=>{
    try {
        const usr=req.session.user_id
        //console.log("userid ss  ",usr);
        const userid=await User.findOne({_id:usr[0]._id})
       // console.log(userid);
        const ads=req.query.adrs
        // console.log(" adresika ",ads);
        const address=await Address.findOne({_id:ads})
        // console.log("address ",address);
       
        const crts=await Cart.findOne({userId:userid})
        const ttl=req.query.totalprc

        const order=new Order({userId:userid,
            date: new Date(),
            totalAmount:ttl, 
            paymentMethod :"Cash on delivery",
            items:crts.items ,
            addresstoDeliver:{
                houseName:address.houseName,
                place:address.place,
                district:address.district,
                pinCode:address.pinCode,
                userEmail:address.userEmail
            },
            orderStatus:"Pending" ,
            deliveredDate:'',
            paymentStatus:"Pending"})

             
        await order.save()
        await Cart.updateOne({userId:userid},{$set:{items:[]}})
        return  res.render("thenks")
        
    } catch (error) {
        console.log(error);
    }
}
const thankupage=async(req,res)=>{
    try {
        return res.render("thenks")
    } catch (error) {
        console.log(error);
        
    }
}
const checkoutPageAddress=async(req,res)=>{
    try {
        const selectedAddressId = req.query.selectedAddressId
            const userData = req.session.user_id
            //console.log(" fetchuser ",userData);
            const user = await User.findOne({_id:userData[0]._id})
            const cartDetails = await Cart.findOne({userId:user._id}).populate('items.product')
            const address = await Address.findOne({_id:selectedAddressId})
            const addresses = await Address.find({userEmail:userData})
            const data = address
           // console.log("its a hell ",address.id);
           return res.json(data)
        
    } catch (error) {
        console.log(error);
    }
}
const loadorderdetails=async(req,res)=>{
    try {
        const ord=req.query.ordid
        //console.log("it hrere");
        const order=await Order.findOne({_id:ord}).populate("items.product")
        return res.render("orderDetails",{order})
        
    } catch (error) {
        console.log(error.message);
    }
}
const itemStatusmanage=async(req,res)=>{
    try {
        console.log(req.query);
        const ordrid=req.query.ordr
        const sts=req.query.qry
        const  num=req.query.count
        
        if(sts==="pending"){
            console.log(" iam here");
            const hol="Cancel"
            const updatedOrder = await Order.findOne({_id:ordrid} )
            updatedOrder.items[num].itemStatus=hol;
            //updatedOrder.totalAmount-=updatedOrder.items[num].price*updatedOrder.items[num].quantity
            updatedOrder.save();
        }else{
            console.log(" iam here too");
            const hol="pending"
            const updatedOrder = await Order.findOne({_id:ordrid})
            updatedOrder.items[num].itemStatus=hol;
           // updatedOrder.totalAmount+=updatedOrder.items[num].price*updatedOrder.items[num].quantity
            updatedOrder.save();
        }
       

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
const loadProduct=async(req,res)=>{
    try {

        const prd=req.query.prctId
        const usr=req.query.userId
        const prdDtls=await Product.findById(prd)
        const user=await User.findById(usr)
        const cart=await Cart.findOne({userId:usr}).populate('items.product')
       
        console.log(cart);
        let alertMessage=false
        console.log("productlist session check  ",req.session.user_id);
        return res.render('productDetails',{product:prdDtls,user,cart,alertMessage})
        
    } catch (error) {
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
const loadTransation=async(req,res)=>{
    try {
        return  res.render('transactions')
        
    } catch (error) {
        console.log(error.message);
    }
}
const logout=async(req,res)=>{
    try{
        console.log("eyyo",req.session);
        req.session.user_id=undefined;
        return res.redirect('/user/login')
        // res.setHeader('Cache-Control', 'no-cache');
        // res.redirect("/user/login")
    }catch(error){
        console.log(error.message);
    }
}
const forgetload=async(req,res)=>{
    try{
        return res.render('forget')
    }catch(error){
        console.log(error.message);
    }
}
module.exports={ 
    loadpage,
    loadRegister,
    loginLoad,
    verifyLogin,
    loadHome,
    searchTerm,
    searchCategory,
    loadProfile,
    loadeditProfile,
    editProfile,
    loadaddAddress,
    addAddress,
    loadeditAddress,
    editAddress,
    deleteAddress,
    loadcart,
    addcart,
    trash,
    quantityIncrease,
    quantityDecrease,
    again,
    loadcheckout,
    checkoutPageAddress,
    loadinvoice,
    loadorderdetails,
    sortItems,
    orderTrack,
    itemStatusmanage,
    logout,
    forgetload,
    OTP,
    verifyOtp,
    resendOtp,
    verifyresendOtp ,
    loadProduct,
    loadTransation,
    thankupage,
    orderlist   
}
// const loadHome = async (req, res) => {
//     try {
//         const product=await Product.find({isActive:true})
//         const category=await Category.find({isBlocked:false})
//         for(let i=0;i<product.length;i++){
//             product[i].category
//             for(let j=0;j<Category.length;j++){
//                if( category[i]._id==product[i].category){
//            product.push(product[i])
        
//                }
//             }
//         }res.render('productList',{product:product})
//         // const products = await Product.aggregate([
//         //     {
//         //         $match: { isActive: true } // Match active products
//         //     },
//         //     {
//         //         $lookup: {
//         //             from: "category", // Assuming the name of your category collection is "categories"
//         //             localField: "category",
//         //             foreignField: "_id",
//         //             as: "category"
//         //         }
//         //     },
//         //     {
//         //         $unwind: "$category"
//         //     },
//         //     {
//         //         $match: { "category.isBlocked": false } // Match categories that are not blocked
//         //     }
           
            
//         // ]);

//         // res.render('productList', { product: products });

//     } catch (error) {
//         console.log(error.message);
//     }
// }
// const addcart=async(req,res)=>{
//     try {
//         const usr = req.body.userid;
//         const prid=req.body.prdid
//         const prd=await Product.findById(prid)
         
//        // const user=await User.findById({usr})
//        console.log("say",prd)
//         res.render('cartPage',{product:prd})
        
//     } catch (error) {
//         console.log(error.message)
//     }
// }