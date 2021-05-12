const Joi = require('joi')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const sendEmail = require('../utils/nodemailer')
const User = require('../models/users')
const Post = require('../models/posts')
const joiValidator = require('../utils/joiValidator')



module.exports = {
  postRegister: async (req, res, next) => {
    try {
      const result = await Joi.validate(req.body, joiValidator)
      const { name, email, password,city,dob } = result
      const foundUser = await User.findOne({ email })
      if (foundUser) {
        if (foundUser.isConfirmed)
          return res.status(404).json({ Error: "You have already enrolled check your email to confirm registration" })
        else
          return res.status(403).json({ Error: "This email already exist" })
      }
      const user = await User.create({
        email,
        name,
        password,
        city,
        dob,
        isThirdPartyUser: false
      });
      await user.hashPassword(user.password)
      const accessToken = await user.generateToken();
      const secretToken = randomstring.generate()
      user.secretToken = secretToken;
      await user.save()
      await sendEmail(user.email, secretToken, "email")
      res.status(201).json({
        message: "you have successfully registerd,pls verify your email",
        body: user,
        token: accessToken
      })
    }
    catch (error) {
      return res.status(401).json({ message: "Bad credentials", body: error.message })
    }
  },
  verfiyEmail: async (req, res, next) => {
    try {
      const { secretToken } = req.params
      const user = await User.findOne({ secretToken })
      if (!user)
        res.status(404).json({ message: "Invalid Token" })
      user.isConfirmed = true
      user.secretToken = ''
      const updatedUser = await user.save()
      res.status(200).json({ message: "You have successfully confirmed your email,now you may login", user: updatedUser })
    }
    catch (err) {
      res.status(500).json({ Error: err.message })

    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const user = await User.find({})
      if (!user)
        res.status(400).json({ message: "No any user have registerd yet" })
      res.status(200).json({ user: user })
    }
    catch (err) {
      res.status(500).json({ Error: err })
    }
  },
  postLogin: async (req, res, next) => {
    try {
      const user = req.user
      if (!user.isConfirmed)
        return res.status(403).json({ message: "you have not confirmed your email yet" })
      const accessToken = await user.generateToken()
      user.accessToken = accessToken
      user.secretToken = ""
      await user.save()
      res.status(201).json({
        message: "you have successfully loggedIn",
        body: user,
        token: accessToken
      })
    }
    catch (err) {
      res.status(500).json({ message: err })
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body
      const user = await User.findOne({ email })
      if (!user)
        return res.status(403).json({ message: "Invalid email" })
      function generateOTP() {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }
      const OTP = await generateOTP()
      user.accessToken = OTP
      await user.save()
      await sendEmail(user.email, OTP, "OTP")
      res.status(200).json({ message: "check your registered email for OTP" })
    }
    catch (err) {
      return res.json(500).json({ Error: err.message })
    }
  },

  postOTP: async (req, res, next) => {
    try {
      const {email, OTP, newPassword } = req.body
      const user = await User.findOne({ 'accessToken': OTP });
      if (!user) {
        return res.status(500).json({ message: "INVALID OTP, check your email again" })
      }
      await user.hashPassword(newPassword)
      user.accessToken = ""
      await user.save()
      return res.status(200).json({ message: "You have successfully changed your password" })
    }
    catch (err) {
      return res.json(500).json({ Error: err.message })
    }


  },
  resetPassword: async (req, res, next) => {
    try {
      const { email, oldPassword, newPassword } = req.body
      const user = await User.findOne({ email })
      if (!user)
        return res.status(403).json({ message: "Invalid user email" })
      const isMatch = await user.isValidPassword(oldPassword)
      if (!isMatch)
        return res.status(403).json({ message: "Incorrect old password" })
      await user.hashPassword(newPassword)
      res.status(200).json({ message: "You have successfully updated your password" })
    }
    catch (err) {
      return res.json(500).json({ Error: err.message })
    }
  },
  logout: async (req, res, next) => {
    try {
      const user = req.user
      user.accessToken = ""
      await user.save()
      return res.status(200).json({ message: "You have successfully logout" })
    }
    catch (err) {
      res.status(500).json({ Error: err.message })
    }
  },
  sendRequest: async (req, res, next) => {
    try {
      const {user:{_id},params:{userId} } = req  
      const user = await User.findOne({ _id: userId })
      const {friendRequest} = user
      const index1 = friendRequest.findIndex((friendList) => {
        return friendList._id.toString() === _id.toString()
      })
      if (index1 !== -1)
      {
        return res.status(401).json({ message: `You have already sent request to ${user.name}`})
      }
      user.friendRequest.push(_id)
      await user.save()
      console.log(friendRequest)
      res.status(200).json({ message: `You have successfully sent request to ${user.name}`});
    }
    catch (err) {
      res.status(500).json({ message: err.message })
    }
  },
  receiveRequest: async (req, res, next) => {
    try {
      const {user:{_id},params:{userId} } = req;
      const receiverUser = await User.findOne({ _id });
      const senderUser = await User.findOne({ _id: userId })
      const {friendRequest} = receiverUser
      const particularRequestIndex = friendRequest.findIndex((request) => {
        return request._id.toString() === userId.toString()
      })
      if (particularRequestIndex === -1)
        return res.status(400).json({ message: "Invalid Request" })
      friendRequest[particularRequestIndex].isConfirmed = true
      receiverUser.friends.push(userId);
      senderUser.friends.push(_id);
      friendRequest.splice(particularRequestIndex,1)
      await senderUser.save();
      await receiverUser.save();
      return res.status(200).json({
        message: "Successfully you have accepted friendRequest. now you both are friend", newFriend: {
          _id: userId,
          name: senderUser.name
        }
      })
    }
    catch (err) {
      res.status(500).json({ Error: err.message })
    }
  },
  unFriend: async (req, res, next) => {
    try {
      const { user, user: { friends }, params: { userId } } = req
      const index1 = friends.findIndex((friendList) => {
        return friendList._id.toString() === userId.toString()
      })
      await friends.splice(index1, 1)
      await user.save();
      const userTwo = await User.findOne({ _id: userId });
      const userTwoFriends = userTwo.friends
      const userOneIndex = userTwoFriends.findIndex((friendss) => {
        return friendss._id.toString() === user._id.toString()
      })
      await userTwoFriends.splice(userOneIndex, 1)
      await userTwo.save();
      res.status(200).json({ message: "You have successfully unfriend your friend" })

    }
    catch (err) {
      res.status(500).json({ Error: err.message })
    }
  },
  deactivateAccount: async (req, res, next) => {
    try {
      const { user: { _id, name, email } } = req
      await sendEmail(email, name, "deactivate")
      let users = await User.find({}); 
      for(let i = 0;i<users.length;i++){
        let currentUserIndex = users[i].friends.indexOf(_id)
        if(currentUserIndex !== -1){
            users[i].friends.splice(currentUserIndex,1)
        }
    }
     await users.save();
      await User.findOneAndDelete({ _id })
      await Post.deleteMany({ user: _id }).populate('comment');
      return res.status(200).json({ message: "You have successfully deleted your account" });
    }
    catch (err) {
      return res.status(500).json({ Error: err.message })
    }
  }
}

