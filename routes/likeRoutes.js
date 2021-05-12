const express = require('express');
const router = express.Router()
const passport = require('passport')
const likeController = require('../controllers/likeController')
const isFriend = require('../utils/isFriend')


//GET ALL LIKE ON USER POsT
router.get('/count/:postId',passport.authenticate('jwt',{session:false}),likeController.getAllLikeOnPost)

//LIKE OR UNLIKE USER POST
router.get('/:postId',passport.authenticate('jwt',{session:false}),isFriend,likeController.likeToggler)



module.exports = router;
