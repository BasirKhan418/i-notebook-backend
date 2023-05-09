const express= require('express');
const router=express.Router();
const Note = require("../models/Notes");
const fetchuser =require("../middleware/getuser");
const { body, validationResult } = require('express-validator');
//fetch all notes to a perticular user using get login required
router.get("/fetchallnotes",fetchuser,async(req,res)=>{
   try{
      const notes = await Note.find({user:req.user.id});
      res.json(notes)

   }catch(error){
      console.log(err.message);
      res.status(500).send("Internal server error")
   }
})
// adding notes into i notebook using post request login required
router.post("/addnote",fetchuser,[
   body("title","Enter a valid title").isLength({ min: 3 }),
   body("description","Description must be greater than five character").isLength({ min: 5 }),
],async(req,res)=>{
   try{
      const {title,description,tag}=req.body;
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
     const note = new Note({
  title,description,tag,user:req.user.id
     })
     const savednote = await note.save();
     res.json(savednote);
    }catch(error){
      console.log(error.message);
      res.status(500).send("Internal server error")
    }
})
//route 3 updating notes using put request login required
router.put("/updatenote/:id",fetchuser,async(req,res)=>{
   try{

const {title,description,tag}=req.body;
const newNote ={};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};
//finding the note
let note = await Note.findById(req.params.id);
if(!note){return res.status(404).send("Not Found")}
if(note.user.toString()!==req.user.id){
   return res.status(401).send("Not Allowed");
}
note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json({note});
      
}catch(error){
   console.log(error.message);
   res.status(500).send("Internal server error")
 }
})
//adaing delete api using delete request login required
router.delete("/deletenote/:id",fetchuser,async(req,res)=>{
   try{
//finding the note
let note = await Note.findById(req.params.id);
if(!note){return res.status(404).send("Not Found")}
if(note.user.toString()!==req.user.id){
   return res.status(401).send("Not Allowed");
}
note = await Note.findByIdAndDelete(req.params.id);
res.json({"Success":"Note Has been Deleted Successfully",note:note})
}catch(error){
   console.log(error.message);
   res.status(500).send("Internal server error")
 }
})
module.exports=router;