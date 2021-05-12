const Post = require('../models/posts');
const User = require('../models/users')
const Comment = require('../models/comments')


const bufferConversion = require("../utils/bufferConversion");
const cloudinary = require("../utils/cloudinary");


module.exports = {
    getAllPostofAllUsers: async (req, res, next) => {
        try {
            const posts = await Post.find({}).populate("user","name").populate({path:"comments",populate:{path:"user"}});
            if (!posts)
                return res.status(500).json({ error: "No post found" })
            res.status(200).json({ message: "All Post", posts: posts })
        }
        catch (err) {
            return res.status(200).json({ error: err.message })
        }
    },
    uploadNewPost: async (req, res, next) => {
        try {
            const { _id } = req.user
            const userPostImg = bufferConversion(req.file.originalname,req.file.buffer)
            const {caption} = req.body;
            const imgResponse = await cloudinary.uploader.upload(userPostImg)
            const userPost = {
                caption : caption,
                imgUrl : imgResponse.secure_url,
                imgid : imgResponse.public_id,
                user : _id
            }
            const user = await User.findById(_id);
            const newPost = new Post({...userPost})
            await newPost.save();
            user.posts.push(newPost._id);
            await user.save();
            res.status(201).json({ message: "new post uploaded successfully", post: {imageUrl:newPost.imgUrl,caption:newPost.caption}, user: {email:user.email,name:user.name,posts:user.posts}})
        }
        catch (err) {
            return res.status(500).json({ message: err })
        }
    },
    updatePost : async(req,res,next)=>{
        try{
            const {postId} = req.params;
            const {caption} = req.body;
            await Post.findOneAndUpdate({_id:postId},{caption:caption})
            res.status(200).json({message:"Post updated Successfully"})
        }
        catch(err){
            res.status(500).json({Error:err.message})
        }
    },
    deletePost: async (req, res, next) => {
        try {
            const { user,user:{posts},params:{postId} } = req
            const postIndex = posts.findIndex((postItem)=>{
                return postItem.toString() == postId.toString()
            })
            if(postIndex === -1)
              return res.status(400).json({message:"Invalid request"})
             await posts.splice(postIndex,1)  
             await user.save();
            // await cloudinary.uploader.destroy(post.imgId)
           //  await Comment.deleteMany({post:postId})
            const deletedPost = await Post.findOneAndDelete({_id:postId})
            await Comment.deleteMany({post:postId})

            res.status(200).json({ message: "Post Deleted Successfully",deletedPost: {imgUrl:deletedPost.imgUrl,caption:deletedPost.caption}, user: {_id:user._id,email:user.email,name:user.name,posts:user.posts}})
        }
        catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

}

// {
//     const post = req.post;
//     await cloudinary.uploader.destroy(post.imgId);
//     await Post.deleteOne({ _id: post._id });
//     await Comment.deleteMany({post:post._id})
//     res.send({message:"SUCEESSFULLY YOU HAVE DELETED YOUR POST"})