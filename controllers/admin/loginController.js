const User = require("../../models/userModels");
const bcrypt = require("bcrypt");

 
 const loadLogin = async (req, res) => {
    try {
      return res.render("adminaccountLogin");
    } catch (error) {
      console.log(error.message);
    }
  }
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
  }
  const loadDashBoard = async (req, res) => {
    try {
      const userData = await User.findById({ _id: req.session.admin_id });
      console.log("admin session ",req.session.admin_id);
      return res.render("dashboardDarkpage", { admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  }
  const logOut = async (req, res) => {
    try {
      req.session.admin_id=undefined
      return res.render("adminaccountLogin");
    } catch (error) {
      console.log(error.message);
    }
  }
module.exports = {
    loadLogin,
    verifyLogin,
    loadDashBoard,
    logOut
}
