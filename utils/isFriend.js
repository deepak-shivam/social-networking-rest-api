const User = require('../models/users')
const Post = require('../models/posts')
module.exports = async (req, res, next) => {
    try {
        if (req.params.userId) {
            const { user, params: { userId } } = req
            const secondUser = await User.findOne({ _id: userId });
            const {friends} = secondUser
            const index = friends.findIndex((friend) => {
                return friend._id.toString() === user._id.toString()
            })
            if (index === -1)
                return res.status(401).json({ message: "Unauthorized, You are not friend of him/her" })
            next()
        }
        if (req.params.postId) {
            const { user, params: { postId } } = req
            const post = await Post.findById(postId)
            const secondUser = await User.findOne({ _id: post.user });
            const {friends} = secondUser
            const index = friends.findIndex((friend) => {
                return friend._id.toString() === user._id.toString()
            })
            if (index === -1)
                return res.status(401).json({ message: "Unauthorized, You are not friend of him/her" })
            next()
        }
    }
    catch (err) {
        return res.status(500).json({ Error: err.message })
    }

}
