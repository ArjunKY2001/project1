const User = require("../../models/userModels");

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

  module.exports = {
    customers,
    userActive
  }
