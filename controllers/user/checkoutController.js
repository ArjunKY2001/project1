
const Address=require('../../models/address')
const Cart=require('../../models/cart')
const User=require('../../models/userModels')
const Order=require('../../models/order')

const loadCheckout=async(req,res)=>{
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
const loadInvoice=async(req,res)=>{
    try {
        const usr=req.session.user_id
        const userid=await User.findOne({_id:usr[0]._id})
        const ads=req.query.adrs
        const address=await Address.findOne({_id:ads})
       
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
const thankuPage=async(req,res)=>{
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
const loadaddAddress=async(req,res)=>{
    try {
        const usadrs=req.query.usad||req.session.user_id[0]._id
        const client=await User.findOne({_id:usadrs})
        return res.render('chechoutPageaddress',{user:client})
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
        return res.redirect('/user/loadcheckout')
        
    } catch (error) {
        console.log(error.message) 
    }
}
module.exports={
    loadCheckout,
    loadInvoice,
    thankuPage,
    checkoutPageAddress,
    loadaddAddress,
    addAddress
}