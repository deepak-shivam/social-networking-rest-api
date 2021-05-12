const mongoose = require('mongoose');
let Schema =  mongoose.Schema;

const postSchema = new Schema({
    imgUrl : {
        type : String,
        default : ""

    },
    caption : {
        type : String,
        trim : true
    },
    imgId:{
        type:String,
        default : ""
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    comments : [{
        type : Schema.Types.ObjectId,
        ref : 'comment'
    }],
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    }
},
{timestamps : true,})


module.exports = mongoose.model('post',postSchema);
