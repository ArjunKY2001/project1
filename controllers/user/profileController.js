const Address=require('../../models/address')
const Order=require('../../models/order')
const User=require('../../models/userModels')


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
        const usr=req.query.usrid
        const usrd=await User.findOne({_id:usr})

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
        
        return res.redirect("/user/profile")
        
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
const orderList=async(req,res)=>{
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
module.exports={
    loadProfile,
    loadeditProfile,
    editProfile,
    loadaddAddress,
    addAddress,
    loadeditAddress,
    editAddress,
    deleteAddress,
    orderList
}