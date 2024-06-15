const Order=require('../../models/order')

const loadOrderdetails=async(req,res)=>{
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
const orderTrack=async(req,res)=>{
    try {
        return res.render('orderTracking') 
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    loadOrderdetails,
    itemStatusmanage,
    orderTrack
}