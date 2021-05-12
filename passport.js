const passport = require('passport')
const {Strategy : jwtStrategy,ExtractJwt }= require('passport-jwt')
const {Strategy : localStrategy} = require('passport-local')
const {Strategy : googleStrategy} = require('passport-google-oauth20') 
const {Strategy: FacebookStrategy } = require("passport-facebook");        
const User = require('./models/users');


//JSONWEBTOKEN strategy 
passport.use(new jwtStrategy({   
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromHeader('authorization'),
        ExtractJwt.fromAuthHeaderWithScheme("JWT"),
        req => req.cookies.accessToken
    ]),
    secretOrKey: process.env.JWT_SECRET_KEY
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false)
        if(!user.accessToken) return done(null,false)
       done(null, user);      //done() takes two argument first error and second data(user)
    }
    catch (err) {
        done(err, false)
    }
}))

//LOCAL STRATEGY
passport.use('local',new localStrategy({
    usernameField: 'email'           //By default passport provide naming convention as username and password
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })   
        if (!user) return done(null, false)
        const isMatch = await user.isValidPassword(password)  
        if (!isMatch) return done(null, false)
        done(null, user)  

    }
    catch (err) {
        done(err,false)
    } 
}))


//GOOGLE STRATEGY
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/redirect"
  },
   async (accessToken, refreshToken, profile, done)=> {
       try{
          const {_json: {email, name, picture}} = profile 
          let user = await User.findOne({email})
          if(!user)
          {
            user = await User.create({email,name,isThirdPartyUser : true,isConfirmed:true})
          }
         return done(null,user)
       }
       catch(err)
       {
        return done(err)
       }
  }
));



//FACEBOOK STRATEGY
const facebookOptions = {
    clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID, 
    clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
    callbackURL: `http://localhost:3000/auth/facebook/redirect`,
    profileFields: ["id", "emails", "name"]
  };
  passport.use(
    new FacebookStrategy(
      facebookOptions,
      async (accessToken, refreshToken, facebookProfile, done) => {
        try {
          const {
            _json: { email, first_name, last_name }
          } = facebookProfile;
      
          let user = await User.findOne({ email });
          if (!user)
            user = await User.create({
              email,
              name: `${first_name} ${last_name}`,
              isThirdPartyUser: true,
              isConfirmed: true
            });
          return done(null, user);
        } catch (err) {
          console.log(err);
          if (err.name === "Error") {
            return done(err);
          }
        }
      }
    )
  );


 
