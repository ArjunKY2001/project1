
const Category = require("../../models/category");
const Product = require("../../models/product");
// const multer = require("multer");
const multer = require("multer");




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  }
})
var upload = multer({
  storage: storage,
}).array("images", 5)
const uploadImage = async (req, res) => {
  const images = req.files.map((file) => file.filename);

  
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
  const loadProduct = async (req, res) => {
    try {
      const product = await Product.find({});
      let alertMessage=false
      return res.render("productsortList", { product: product ,alertMessage});
    } catch (error) {
      console.log(error);
    }
  };
  const loadAddproduct = async (req, res) => {
    try {
      const prd = await Product.find({});
      const cat = await Category.find({isBlocked:false});
      //console.log(cat[0].name);
  
      return res.render("addProduct", { product: prd, category: cat });
    } catch (error) {
      console.log(error);
    }
  };
  const addProduct = async (req, res) => {
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
  const editProduct = async (req, res) => {
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
  const updateProduct = async (req, res) => {
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
  module.exports={
    loadProduct,
    productActive,
    updateProduct,
    editProduct,
    uploadImage,
    loadAddproduct,
    addProduct
  }