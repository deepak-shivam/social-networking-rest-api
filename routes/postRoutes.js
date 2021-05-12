const express = require('express');
const router = express.Router()
const passport = require('passport')
const postController = require('../controllers/postController')
let upload = require("../utils/multer")


//GET RANDOM POST OF RANDOM USER
router.get('/',passport.authenticate('jwt',{session:false}),postController.getAllPostofAllUsers)

//UPLOAD NEW POST
router.post('/',passport.authenticate('jwt',{session:false}),upload.single("fileName"),postController.uploadNewPost)

//UPDATE POST
router.patch('/:postId',passport.authenticate('jwt',{session:false}),postController.updatePost)

//DELETE POST
router.delete('/:postId',passport.authenticate('jwt',{session:false}),postController.deletePost)








module.exports = router