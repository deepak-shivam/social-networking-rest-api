const express = require('express');
const router = express.Router()
const passport = require('passport')
const commentController = require('../controllers/commentController')
const isFriend = require('../utils/isFriend')



//COMMENT ON SOMEONE'S POST
router.post('/:postId',passport.authenticate('jwt',{session:false}),isFriend,commentController.commentOnSomeonePost)

//UPDATE COMMENT
router.patch('/:commentId',passport.authenticate('jwt',{session:false}),commentController.updateComment)

//DELETE COMMENT
router.delete('/:commentId',passport.authenticate('jwt',{session:false}),commentController.deleteComment)


module.exports = router;