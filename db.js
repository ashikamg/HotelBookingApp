const mongoose = require("mongoose");

 var mongoURL = 'mongodb+srv://Ashikamg123:ashikamg2000@cluster0.uvtvi9g.mongodb.net/mern-roons'

mongoose.connect(mongoURL , {useUnifiedTopology:true , useNewUrlParser:true})

var dbconnect = mongoose.connection

dbconnect.on('error' , ()=>{
    console.log(`Mongo DB Connection Failed`);
})

dbconnect.on('connected' , ()=>{
    console.log(`Mongo DB Connection Successfull`);
})

module.exports = mongoose