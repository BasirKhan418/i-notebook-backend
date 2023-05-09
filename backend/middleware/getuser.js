const jwt = require("jsonwebtoken");
require("dotenv").config({path:"./.env"});
const Jwt_Secret = process.env.Jwt_Secret;
const fetchuser =(req,res,next)=>{
const token =req.header('auth-token');
if(!token){
    res.status(401).send({error:"Please Authrnticate using a valid token1"})
}
try{
const data=jwt.verify(token,Jwt_Secret);
req.user=data.user;
next()
}catch(err){
    res.status(401).send({err:"Please Authrnticate using a valid token2"})
}
}
module.exports=fetchuser