const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isThirdPartyUser: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: function () {
            return !this.isThirdPartyUser
        },
        trim: true
    },
    city: {
        type: String,
        trim: true,
        default:""
    },
    dob: {
        type: String,
        default : ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    isConfirmed: {
        type: Boolean,

        default: false,
        required: true
    },
    secretToken: {
        type: String,
        trim: true

    },
    accessToken: {
        type: String,
        trim: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    friends: [
        {
            user :{
                type : Schema.Types.ObjectId,
                ref : 'user'
            }
        }
   ],
    friendRequest: [{
        user : {
            type : Schema.Types.ObjectId,
            ref : 'user'
        },
        isConfirmed : {
            type : Boolean,
            default : false 
        }
    }]
},
    {
        timestamps: true
    })

userSchema.methods.generateToken = async function () {
    try {
        const user = this;
        const accessToken = jwt.sign({
            id: user.id,
            iat: new Date().getTime(),   //current time
            exp: new Date().setDate(new Date().getDate() + 1)  //current time + one day ahead
        }, process.env.JWT_SECRET_KEY)
        user.accessToken = accessToken,
            await user.save()
        return accessToken
    }
    catch (err) {
        throw new Error(err);
    }
}

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password)       //it returns boolean value
    }
    catch (err) {
        throw new Error(err);
    }
}
userSchema.methods.hashPassword = async function (password) {
    try {
        const user = this
        const bcryptSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, bcryptSalt)
        user.password = hashedPassword
        await user.save()
        return hashedPassword
    }
    catch (err) {
        throw new Error('Hashing failed', err.message)
    }
}

module.exports = mongoose.model('user', userSchema);

