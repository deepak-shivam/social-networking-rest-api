const User = require('../models/users')
module.exports = async (req, res, next) => {
try{
    const {user:{_id},params:{userId} } = req  
    const user = await User.findOne({ _id: userId })
    const {friends} = user
    const index = friends.findIndex((friendLists)=>{
       return friendLists._id.toString() === _id.toString()
    }) 
    if(index !== -1)
    {
       return res.status(401).json({message:`Invalid Request,You are already ${user.name}'s friend`})
    }
    next()   
}
catch(err){
    res.status(500).json({Error:err})
}
}