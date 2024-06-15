
const User=require('../models/userModels')

const loadProfile=async(req,res)=>{
    try {
        res.render('userProfile')
        
    } catch (error) {
        console.log(error.message)
        
    }
}
module.exports={
    loadProfile
}