const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes =  require('../models/Notes');
const { body, validationResult } = require('express-validator');  // for validating that the format of inpit is correct i.e email is of type mail


// getting all the notes of the user using get as it will not  need the user data to accept  ony it will return 

router.get('/fetchallnotes', fetchuser ,async (req , res)=> {

  try {
    const notes = await Notes.find({user : req.user.id});
    res.json(notes)
    
  } catch (error) {
res.send( "some internal error occured");
    
  }
});



//  creating the notes for the user
router.post('/addnotes' , fetchuser , [body('title').isLength({min:3}), body('description').isLength({min:3})] , async (req, res) => {
 
  //  here it checks if there exists some error in the entered values i.e title and description are not null
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors : "title or description cannot be null" });
   
 }
 try {
  
 
//  creating a note for saving using post as it will also need the user data to accept 

 const note = await new Notes({
  user : req.user.id,
  title : req.body.title,
  description : req.body.description,
  tag : req.body.tag
 })
//  saving a note
 await note.save();

 res.json(note);
} catch (error) {
res.send( {'error':"some internal error occured"});
  
}
})


//  updating the already present note in the system  using post as it will also need the user data to accept 

router.post('/updateNotes/:id' , fetchuser , [body('title').isLength({min:3}), body('description').isLength({min:3})] , async (req, res) => {
 
  //  here it checks if there exists some error in the entered values i.e title and description are not null
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors:"title or description cannot be null" });
   
 }
 try {
const newNote = {
  user : req.user.id,
  title : req.body.title,
  description : req.body.description,
  tag : req.body.tag
 }
 let note = await Notes.findById(req.params.id);
 if(!note)
 {
 return  res.status(404).send("not found");
 }
note = await Notes.findByIdAndUpdate(req.params.id , {$set : newNote} , { new : true});
res.json(note);
} catch (error) {
  res.send( "some internal error occurred ")

  
}
});




//  deleting the already present note in the system  using DELETE as it will delete the already present note
router.delete('/DeleteNotes/:id' , fetchuser , async (req, res) => {
 

 try {
// finding  the note if it is present in the database or not 
 let note = await Notes.findById(req.params.id);
 if(!note)
 {
 return  res.status(404).send("not found");
 }

note = await Notes.findByIdAndDelete(req.params.id);
res.send ({'success':"succesfully deleted"})

} catch (error) {
res.send( "some internal error occurred ")
  
}
});

module.exports = router;
