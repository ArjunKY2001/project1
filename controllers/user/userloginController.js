const User=require('../../models/userModels')
const bcrypt=require('bcrypt')
const otpGenerator = require('otp-generator')
const Otp=require('../../models/otp')
const nodemailer=require('nodemailer')
const Cart=require('../../models/cart')
const Category = require("../../models/category")

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
        return res.render("userRegister")
    }catch(error ){
        console.log(error.message);
    }
}
const loadPage=async(req,res)=>{
    try {
        return res.render('index')
    } catch (error) {  
        console.log(error.message);
    }
}
const OTP=async(req,res)=>{
   try {
    const {username,email,password,mobile}=req.body;
    const semail=email
    const isit= User.findOne({email:semail})
    if(isit){
        return res.redirect("loadRegister")
    }
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
   await Otp.create(otpPayload);
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
    const west=response.otp
    const hif=west.toString()
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
            // console.log("response.otp : ",response.otp);
            // console.log("enteredOTP : ",enteredOTP);
            
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
    
    const userNotfound=req.session.user_not_found
    const passwordNotfound=req.session.passworderror

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

        if(userData){
        if (password !== userData.password) {
            console.log("userData.password  ",userData.password)
            req.session.passworderror=true
            return res.redirect('/user/login')
        } else {
            req.session.user = req.body.email
            req.session.isLoggedUser = true;
            const userActive=await User.find({email:req.body.email,is_active:true})
            if(userActive){
                req.session.user_id=userActive
                // const carts=await Cart.findOne({userId:req.session.user_id[0]._id})
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
const logOut=async(req,res)=>{
    try{
        req.session.user_id=undefined;
        return res.redirect('/user/login')
    }catch(error){
        console.log(error.message);
    }
}
module.exports={
    loadPage,
    loadRegister,
    loginLoad,
    verifyLogin,
    OTP,
    verifyOtp,
    resendOtp,
    verifyresendOtp,
    logOut
    
}