const express = require('express')
const router = express.Router()
const {getAllUsers,postRegister,postLogin,verfiyEmail,forgotPassword,postOTP,resetPassword,logout,sendRequest,receiveRequest,unFriend,deactivateAccount} = require('../controllers/userController')
const passport = require('passport');
const alreadyFriend = require('../utils/alreadyFriend')
const isFriend = require('../utils/isFriend')



//GET ALL USER
router.get('/',getAllUsers)

//REGISTER
router.post('/register',postRegister);

//LOGIN
router.post('/login',passport.authenticate('local',{session:false}),postLogin);

//VERIFY EMAIL
router.get('/verifyEmail/:secretToken',verfiyEmail)

//FORGOT PASSWORD
router.post('/forgotPassword',forgotPassword);
router.post('/submitOTP',postOTP);

//RESET PASSWORD
router.post('/resetPassword',resetPassword) 

//LOGOUT
router.delete("/logout",passport.authenticate('jwt',{session:false}),logout)

//SEND FRIEND REQUEST
router.get('/sendRequest/:userId',passport.authenticate('jwt',{session:false}),alreadyFriend,sendRequest)

//ACCEPT FREIND REQUEST
router.get('/acceptRequest/:userId',passport.authenticate('jwt',{session:false}),alreadyFriend,receiveRequest)

//UNFRIEND SOMEONE
router.get('/unfriend/:userId',passport.authenticate('jwt',{session:false}),isFriend,unFriend)

//DEACTIVATE YOUR ACCOUNT
router.delete('/deactivate',passport.authenticate('jwt',{session:false}),deactivateAccount)

//SECRET ROUTE
router.get('/secret',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.status(200).json({message:"this is restrictred route",body:req.user})
})




module.exports = router