const jwt = require("jsonwebtoken");
const Jwt_Secret = "inotebookBasir#$#@!@#$";
const fetchuser =(req,res,next)=>{
const token =req.header('auth-token');
if(!token){
    res.status(401).send({error:"Please Authrnticate using a valid token"})
}
try{
const data=jwt.verify(token,Jwt_Secret);
req.user=data.user;
next()
}catch(err){
    res.status(401).send({err:"Please Authrnticate using a valid token"})
}
}
module.exports=fetchuser