const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const cors = require('cors');
const googleRoutes = require('./routes/googleAuth');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes')



require('./db')
require('./passport')
require('./payment')


//MIDDILWARES
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: `http://localhost:1234`,
    credentials: true,
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(morgan('dev'))


//ROUTES

app.use('/user',userRoutes);
app.use('/auth',googleRoutes);
app.use('/post',postRoutes);
app.use('/comment',commentRoutes);
app.use('/like',likeRoutes);
app.use('/payment',require('./routes/paymentRoutes'))


//Catching 404 Error
app.use((req, res, next) => {
    const error = new Error('INVALID ROUTE')
    error.status = 404
    next(error);
})

//Error handler function
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
const PORT = process.env.PORT || 3000 ;

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})