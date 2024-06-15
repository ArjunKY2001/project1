const User=require("../models/userModels")

const isLogin = async (req, res, next) => {
    try {
      if (req.session.user_id) {
        console.log(req.session.user_id);
        // const usr = await User.findOne({ _id: req.session.user_id[0] });
        if (req.session.user_id[0].is_active === true) {
          return next()
        }else{
          return res.redirect('/user/logoutpage'); // Return stops execution
        }
      } else {
        console.log("user logout ",req.session.user_id);
        return res.redirect('/user/login'); // Return stops execution
      }
      //  return next(); // Call next only if no redirection
    } catch (error) {
      console.log(error);
      next(error); // Pass error to the error handler
    }
  };
  
  const isLogout = async (req, res, next) => {
    try {
      if (req.session.user_id) {
        return res.redirect('/home'); // Return stops execution
      }
      next(); // Call next only if no redirection
    } catch (error) {
      console.log(error.message);
        next(error); // Pass error to the error handler
    }
  };
  
  const isAdmin = async (req, res, next) => {
    try {
        // Check if the user is logged in
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Fetch the user from the database using the userId stored in the session
        const user = await User.findById(req.session.userId);
        // Check if the user exists and is an admin
        if (!user || !user.is_admin) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        // User is an admin, allow access to the route
        next();
    } catch (error) {
        console.error('isAdmin middleware error:', error);
        return  res.status(500).json({ error: 'Internal Server Error' });
    }
   }


module.exports = {
    isLogin,
    isLogout,
    isAdmin
}