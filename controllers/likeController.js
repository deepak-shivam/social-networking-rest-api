const Post = require('../models/posts');



module.exports = {
    getAllLikeOnPost : async(req,res,next)=>{
        try{
            const {postId} = req.params;
            const post = await Post.findOne({_id:postId})
            if(!post)
            return res.status(404).json({message:"invalid Request"})
            res.status(200).json({totalLikes:post.likes.length,likes:post.likes})
        }
        catch(err){
            res.status(500).json({ Error: err.message })
        }
    },
    likeToggler: async (req, res, next) => {
        try {
            const { user,params:{postId} } = req
            const post = await Post.findOne({ _id: postId })
            if (!post)
                return res.status(403).json({ message: "Invalid Request" })
            const likeArr = post.likes
            const findIndex = likeArr.findIndex((likeArray) => {
                return likeArray.toString() === user._id.toString()
            })
            if (findIndex === -1) { 
                post.likes.push(user._id)
                await post.save()
               
            }
            else {
                likeArr.splice(findIndex, 1)
                await post.save()
                res.status(200).json({ message: "You have successfully unliked users post" })
            }

        }
        catch (err) {
            res.status(500).json({ Error: err.message })
        }

    }
}
