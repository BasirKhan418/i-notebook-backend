const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();
const fetchuser =require("../middleware/getuser");
const { body, validationResult } = require('express-validator');
require("dotenv").config({path:"./.env"});
//route1 create user using post request doesnot require auth no login required
const Jwt_Secret = process.env.Jwt_Secret;
router.post(
  "/createuser",
  [
    body("name","Your a valid name").isLength({ min: 3 }),
    body("email","Enter a valid email").isEmail(),
    body("password","Your password must be greater than five character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    //validation for icorrect credentials
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    //validation for dublicate entry\\
   let user= await User.findOne({email:req.body.email});
   if(user){
    success=false;
    return res.status(400).json({success,error:"Sorry a user with this email already exists"})
   }
   const salt = await bcrypt.genSalt(10);
   const secPass = await bcrypt.hash(req.body.password,salt);
   user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      const data ={
        user:{
          id:user.id
        }
      }
      const authtoken= jwt.sign(data,Jwt_Secret);
      success=true;
      res.json({success,authtoken});
    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal server error")
    }
  }
);
// route 2Authenticate a user using post request no login required
router.post("/login", [
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false
    //validation for correct credentials
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
    let user =await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Please login with correct crendentials"})
    }
    const passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      success=false
      return res.status(400).json({error:"Please login with correct crendentials"});
    }
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken= jwt.sign(data,Jwt_Secret);
    success=true
    res.json({success,authtoken});
  }
    catch(err){
      console.log(err.message);
      res.status(500).send("Internal server error occured")
  }
  })
  //route get loged in user details post request logging required
  router.post("/getuser",fetchuser, async (req, res) => {
  try{
    userId=req.user.id;
const user =await User.findById(userId).select("-password")
res.send(user)
  }catch(err){
    console.log(err.message);
      res.status(500).send("Internal server error occured")
  }
})
module.exports = router;
