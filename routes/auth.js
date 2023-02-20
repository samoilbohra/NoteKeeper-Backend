const express = require('express'); 
const User = require('../models/User');   // requiring the schema of the user
const router = express.Router();  // for router .post 
const { body, validationResult } = require('express-validator');  // for validating that the format of inpit is correct i.e email is of type mail
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');
const dotenv = require("dotenv")
const env = dotenv.config({path : "../config/config.env"});
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET)

// it has the the validation through which the data goes so that it could be saved in the database 
const validate = [body('email').isEmail(), body('name').isLength({min:3})]; 

// creting a user using and validating its id and password to  storing its id and password in the database
router.post('/createuser' ,  validate ,async (req , res)=> {
  let success = false;

  //  here it checks if there exists some error in the entered values 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success , error:"enter valid details " });
    
  }
  // after the entered details is correct it try to chack  and save tghe user in the database 
  try{
    // if there is no errror in the entered values of the user then it checks it the email already exists in the database  

  let user =  await User.findOne({email : req.body.email});
  if(user)
  {
       return res.status(400).json({success, errors:"user already registered" });
  }

  // hashing the passwprd before storing the user password in database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password , salt)
  //  if all data is correct and emaul does not exist inn thhe email then it saves in the database 
  user = await User.create({
    name: req.body.name,
    password: hashedPassword,
    email : req.body.email
  })
  // .then(user => res.json(user)).catch(err =>{
  //   console.log("error FOund");
  //   res.json({name: "email id already registered" , mess: err.message})
  // });
  // res.send(user)
  const data = {
    user : {
      id : user.id
    }
  }
  const authToken =  jwt.sign(data ,JWT_SECRET);
  console.log(authToken);
  success = true;
  res.json({success , authToken})
}
catch (errror )
{
  res.send( {success: success ,error:"some internal error occured"})
}
});


//  creating the login endpoint to authenticate the user 

router.post('/login' ,  [body('email').isEmail(), body('password').exists()] ,async (req , res)=> {
  let success = false;

   //  here it checks if there exists some error in the entered values 
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ success,errors:"enter valid details " });
     
   }
 // after the entered details is correct it try to chack  and save tghe user in the database 
 try{
  // if there is no errror in the entered values of the user then it checks it the email already exists in the database  
let user =  await User.findOne({email : req.body.email});
if(!user) // if user does not exist
{
     return res.status(400).json({ success , errors:"Enter the Valid details user id or password incorrect" });
}
//  if the user with email exists then we will check for the password entered is correct or not 
const comparePassword = await  bcrypt.compare(req.body.password , user.password);
if(!comparePassword) //if password is incorrect
{
  return res.status(400).json({success, errors:"Enter the Valid details user id or password incorrect" });
}
const data = {
  user : {
    id : user.id
  }
}
const authToken =  jwt.sign(data ,JWT_SECRET);
console.log(authToken);
success = true;
res.json({success , authToken})
}
catch (errror )
{
res.send( { success , error:"some internal error occured"})
}
 
});



//  Get logged in user details using middle ware o verify that the user is valid user

router.post('/getuser' ,  fetchuser ,async (req , res)=> { 
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
res.send( "some internal error occured")
  
}


});


module.exports = router;
