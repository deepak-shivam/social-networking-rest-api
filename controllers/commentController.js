const Post = require('../models/posts');
const Comment = require('../models/comments')
const User = require("../models/users")

module.exports = {
    commentOnSomeonePost: async (req, res, next) => {
        try {
            const { user,params:{postId} } = req
            const commentBody = new Comment(req.body)
            const post = await Post.findById(postId)
            await post.comments.push(commentBody);
            await post.save();
            commentBody.user = user._id;
            commentBody.post = postId;
            await commentBody.save()
            res.status(201).json({ message: "commented Successfully", commentedBy: { userName: user.name, userId: user._id }, commentedOn: { postUrl: post.imgUrl, postCaption: post.caption, userId: post.user } })
        }
        catch (err) {
            return res.status(500).json({ error: err.message })
        }
    },
    updateComment: async(req,res,next)=>{
        try{
            const {user} = req
            const {commentId} = req.params
            const {body} = req.body;
            const comment = await Comment.findById(commentId);
            if(!comment)
            return res.status(404).json({message:"Invalid Request"})
            if(comment.user.toString() !== user._id.toString())
            return res.status(404).json({message:"Invalid Request"})
            await Comment.findOneAndUpdate({_id:commentId},{body:body})
            res.status(200).json({message:"Comment updated successfully"})
        }
        catch(err){
            res.status(500).json({Error:err.message})
        }
    },
    deleteComment : async(req,res,next)=>{
        try{
            const {user} = req;
            const {commentId} = req.params;
            const comment = await Comment.findById(commentId);
           if(comment.user.toString() !== user._id.toString())
           return res.status(404).json({message:"Invalid Request"})
           const post = await  Post.findById(comment.post)
           const allComments = post.comments
           const commentIndex = allComments.findIndex((comments)=>{
               return comments.toString() === commentId.toString()
           })
           if(commentIndex === -1)
           return res.status(404).json({message:"Invalid Request"}) 
           await allComments.splice(commentIndex,1)
           await post.save()
           await Comment.findOneAndDelete({_id:commentId})
            res.status(200).json({message:"Deleted Successfully"})
        }
        catch(err){
            res.status(500).json({Error:err})
        }
    }
   
}