const Product=require('../../models/product')
const Cart=require('../../models/cart')
const User=require('../../models/userModels')


const  loadCart=async(req,res)=>{
    try {
        const user =req.session.user_id
      // console.log(user);
        //const prid=req.body.prdid
        const cart=await Cart.findOne({userId:user[0]._id}).populate("items.product")
       // console.log(" griu",cart.items.product.name);
       return res.render('cartPage',{cart})
    } catch (error) {
        console.log(error.message)
    }
}
const addCart = async (req, res) => {
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
        // const cart=await Cart.findOne({userId: usr}).populate("items.product")
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
        console.log("product.stock ",product.stock);
        console.log("cart.items[indexOfItems].quantity ",cart.items[indexOfItems].quantity);
        
        if(product.stock>cart.items[indexOfItems].quantity){
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
module.exports={
    loadCart,
    addCart,
    trash,
    quantityIncrease,
    quantityDecrease
}