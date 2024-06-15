const Category = require("../../models/category");


const loadCategory = async (req, res) => {
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

  module.exports={
    loadCategory,
    addCategory,
    catActive,
    loadEditcat,
    catUpdate

  }