const mongoose = require('mongoose');
let Schema =  mongoose.Schema;

const likeSchema = new Schema({
    like : {
        type : Boolean
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    }
},
{timestamps : true,})


module.exports = mongoose.model('like',likeSchema);
