const loadTransation=async(req,res)=>{
    try {
        return  res.render('transactions')
    } catch (error) {
        console.log(error.message);
    }
}
const forgetLoad=async(req,res)=>{
    try{
        return res.render('forget')
    }catch(error){
        console.log(error.message);
    }
}
module.exports={
    loadTransation,
    forgetLoad
}