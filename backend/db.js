const mongoose = require('mongoose');
require("dotenv").config({path:"./.env"});
const MONGO_URI =process.env.MONGOURI;
const connectToMongo=async()=>{
    await mongoose.connect(`${MONGO_URI}`)
    .then(()=>{
        console.log("connected to mongo successfully!!")
    }).catch((err)=>{
       console.log("Error Occurs ",err);
    })
}
module.exports=connectToMongo;