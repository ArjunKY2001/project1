
const User = require("../models/userModels");
const Category = require("../models/category");
const Product = require("../models/product");
const multer = require("multer");
//const uploads = multer({ dest: 'uploads/' });
const bcrypt = require("bcrypt");
// const category = require("../models/category");

const Order=require("../models/order")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
var upload = multer({
  storage: storage,
}).array("images", 5)
const loadLogin = async (req, res) => {
  try {
    return res.render("adminaccountLogin");
  } catch (error) {
    console.log(error.message);
  }
};
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_admin === 0) {
          return res.render("adminaccountLogin", {
            message: "Email and password1 is incorrect ",
          });
        } else {
          req.session.admin_id = userData._id;
          //res.render("orderDetails")
          return res.redirect("/admin/home");
        }
      } else {
        return res.render("adminaccountLogin", {
          message: "email and password is incorrect",
        });
      }
    } else {
      return res.render("adminaccountLogin", {
        message: "Email and password3 is incorrect",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadDashBoard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.admin_id });
    console.log("admin session ",req.session.admin_id);
    return res.render("dashboardDarkpage", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    //res.redirect('/admin/login')
    req.session.admin_id=undefined
    return res.render("adminaccountLogin");
  } catch (error) {
    console.log(error.message);
  }
};
const customers = async (req, res) => {
  try {
    const user = await User.find({});
    return res.render("customersList", { user: user });
  } catch (error) {
    console.log(error.message);
  }
};
const userActive = async (req, res) => {
  try {
    const userId = req.query.userId;

    const user = await User.findOne({ _id: userId });

    if (user.is_active === true) {
      await User.findOneAndUpdate({ _id: userId }, { is_active: false });
    } else {
      await User.findOneAndUpdate({ _id: userId }, { is_active: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadProduct = async (req, res) => {
  try {
    const product = await Product.find({});
    let alertMessage=false
    return res.render("productsortList", { product: product ,alertMessage});
  } catch (error) {
    console.log(error.message);
  }
};
const loadaddproduct = async (req, res) => {
  try {
    const prd = await Product.find({});
    const cat = await Category.find({isBlocked:false});
    //console.log(cat[0].name);

    return res.render("addProduct", { product: prd, category: cat });
  } catch (error) {
    console.log(error.message);
  }
};
const addproduct = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    const { Name, Description, Price, Stock, category } = req.body;
    console.log(req.body);

    const response = await Product.find({ name: Name });

    if (response.length > 0) {
      return res.render("addProduct", {
        message: "This product already exists",
      });
    }

    const images = req.files.map((file) => file.filename);

    //const image=req.body.images
    //console.log(image);
    const product = new Product({
      name: Name,
      discription: Description,
      images: images,
      category: category,
      price: Price,
      stock: Stock,
    });

    try {
      await product.save();
      console.log("New product:", product);
      
      res.redirect("/admin/productlist");
    } catch (error) {
      console.error("Error saving product:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
};
const uploadImage = async (req, res) => {
  const images = req.files.map((file) => file.filename);

  //const image=req.body.images
  //console.log(image);
  const product = new Product({  
    name: Name,
    discription: Description,
    images: images,
    category: category,
    price: Price,
    stock: Stock,
  });
  return res.status(200).json();
};
const editproduct = async (req, res) => {
  try {
    const obj = req.query.prdId;

    const product = await Product.findOne({ _id: obj });
    const category = await Category.find({ isBlocked: false });
    // console.log('hello'+category);
    return res.render("productedit", { product, category });
  } catch (error) {
    console.log(error.message);
  }
};
const updateproduct = async (req, res) => {
  upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
          return res.status(500).json(err);
      } else if (err) {
          return res.status(500).json(err);
      }

      //console.log("In update");

      const productId = req.params.id;
      console.log("PRO", productId);

      try {
          const { Name, Description, Price, Stock, category } = req.body;
          console.log(req.body);
          const images = req.files.map(file => file.filename);
          const product=await Product.find({name:Name})

          // if(product){
          //   const product = await Product.find({});
          //   let alertMessage="Not changed.this name is already exists"
          //   res.render("productsortList", { product: product ,alertMessage});

          // }else{
          await Product.findOneAndUpdate(
              { _id: productId },
              {
                  name: Name,
                  discription: Description,
                  images: images,
                  category: category,
                  price: Price,
                  stock: Stock
              },
              { new: true }
          );

          return res.redirect("/admin/productlist");
        //}
      } catch (error) {
          console.log(error.message);
          return  res.status(500).send("Internal Server Error");
      }
  });
};
const productActive = async (req, res) => {
  try {
    const prdis = req.query.prdId;
    const product = await Product.findOne({ _id: prdis });
    if (product.isActive === true) {
      await Product.findOneAndUpdate({ _id: prdis }, { isActive: false });
    } else {
      await Product.findOneAndUpdate({ _id: prdis }, { isActive: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadcategory = async (req, res) => {
  try {
    const catid = await Category.find({});
    return res.render("category", { Category: catid,showAlert: false  });
  } catch (error) {
    console.log(error.message);
  }
};
const addCategory = async (req, res) => {
  try {
    const ename = req.body.name;
      const regexPattern = new RegExp(`^${ename}$`, 'i'); 
      const existingDocument = await Category.findOne({ name: regexPattern });
      if(existingDocument) {
        const catid = await Category.find({});
        return res.render("category", { Category: catid, showAlert: true });
    } else {
      const category = await Category.create({
        name: ename
      });
      return  res.redirect('/admin/category')
    }
  } catch (error) {
    console.log(error.message);
  }
};
const catActive = async (req, res) => {
  try {
    const catId = req.query.catId;
    const category = await Category.findOne({ _id: catId });
    if (category.isBlocked == false) {
      await Category.findOneAndUpdate({ _id: catId }, { isBlocked: true });
    } else {
      await Category.findOneAndUpdate({ _id: catId }, { isBlocked: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadEditcat = async (req, res) => {
  try {
    const catId = req.query.catId;
    const categoryDetails = await Category.find({ _id: catId });
    return res.render("editCategory", { Category: categoryDetails });
  } catch (error) {
    console.log(error.message);
  }
};
// const checkcatName=async(req,res)=>{
//   try {
//     const { name } = req.body;
//     if (database.has(name)) {
//         res.json({ exists: true });
//     } else {
//         res.json({ exists: false });
//     }
    
//   } catch (error) {
//     console.log(error.message);
//   }
// }
const catUpdate = async (req, res) => {
  try {
    const newName = req.body.name
    const catId = req.body.catId
    // console.log("catid",catId);
    const check= await Category.findOne({name: { $regex: new RegExp(`^${newName}$`, 'i') }})
    if(check){
      const categoryDetails = await Category.find({})
      return res.render('editCategory',{Category: categoryDetails,message:"This name is already exist"})
    }else{
    await Category.findOneAndUpdate({ _id: catId }, { name: newName })
    return res.redirect("/admin/category")}
  } catch (error){
    console.log(error.message)
  }
}
// const adminDashboard = async (req, res) => {
//   try {
//     const usersData = await User.find({ is_admin: 0 });
//     return res.render("dashboard", { users: usersData });
//   } catch (error) {
//     console.log(error.message);
//   }
// }
const loadorder=async(req,res)=>{
  try {
    const order=await Order.find({}).sort({date:-1})
    return res.render("orderPage",{order})
    
  } catch (error) {
     console.log(error.message);
  }
}
const orderstatus =async(req,res)=>{
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
    console.log(" order:> ",ordersts,"id ",orderid);
     await Order.findOneAndUpdate({_id:orderid},{$set:{orderStatus:ordersts}}, { new: true }) 
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
  loadLogin,
  verifyLogin,
  loadDashBoard,
  customers,
  userActive,
  loadcategory,
  addCategory,
  catActive,
  loadEditcat,
  catUpdate,
  loadProduct,
  loadaddproduct,
  addproduct,
  uploadImage,
  editproduct,
  updateproduct,
  productActive,
  loadorder,
  orderstatus,
  orderstatusManager,
  orderDetails,
  logout,
};
