const mongoose = require('mongoose');
let Schema =  mongoose.Schema;

const commentSchema = new Schema({
    post : {
        type:Schema.Types.ObjectId,
        ref:"post"
    },
    body : {
        type : String,
        trim : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    }
},
{timestamps : true,})


module.exports = mongoose.model('comment',commentSchema);
