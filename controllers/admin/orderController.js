const Order=require("../../models/order")


 const loadOrder=async(req,res)=>{
    try {
      const order=await Order.find({}).sort({date:-1})
      return res.render("orderPage",{order})
    } catch (error) {
       console.log(error.message);
    }
  }
  const orderStatus =async(req,res)=>{
    try {
      const orderId = req.query.ordId;
      const order = await Order.findOne({ _id: orderId });
     //console.log(user);
      if (order.orderStatus == "Pending") {
        await Order.findOneAndUpdate({ _id:orderId  }, { orderStatus: 'delivered' });
      } else {
        await Order.findOneAndUpdate({ _id:orderId  }, { orderStatus: "Pending" });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const orderDetails =async(req,res)=>{
    try {
        const ordid=req.query.dtls
        //console.log(ordid);
        const order=await Order.findOne({_id:ordid}).populate([
          { path: "items.product" },
          { path: "addresstoDeliver.houseName" },
          { path:"userId"}])
        // console.log("here ",order);
        
       return res.render('orderdetails',{order})
    } catch (error) {
      console.log(error.message)
    }
  }
  const orderstatusManager=async(req,res)=>{
    try {
      //const usrid=req.session.user_id
      const ordersts=req.query.sts
      const orderid=req.query.orderid
      // console.log(" order:> ",ordersts,"id ",orderid);
       await Order.findOneAndUpdate({_id:orderid},{$set:{orderStatus:ordersts}}, { new: true }) 
    } catch (error) {
      console.log(error.message);
    }
  }
  module.exports={
    loadOrder,
    orderDetails,
    orderStatus,
    orderstatusManager
  }
