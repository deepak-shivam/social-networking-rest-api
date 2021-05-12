const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/majorProject',{useCreateIndex:true,useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false})
   .then(()=>{
       console.log('connected to database');
   })
   .catch((err)=>{
       console.log('Erro in connecting to database',err)
   })