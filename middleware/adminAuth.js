const isLogin=async(req,res,next)=>{
    try{
        if(req.session.admin_id){
        }
        else{
            console.log("admin  ",req.session.admin_id);
            return res.redirect('/admin/login')
        }
        next()
    }catch(error){
        console.log(error.message)
    }
}
const isLogout=async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            return res.redirect('/admin/home')
        }
        next()
    }catch(error){
        console.log(error.message)
    }
}
module.exports={
    isLogin,
    isLogout

}