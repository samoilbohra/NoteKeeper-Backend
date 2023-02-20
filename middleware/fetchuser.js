const jwt = require("jsonwebtoken") ;
const dotenv = require("dotenv")
const env = dotenv.config({path : "../config/config.env"});
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET)


const fetchuser = (req , res , next)=>
{    
    // getting the user from jwt token 
    const token =req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error : "please authenticate useing a valid token"});
    }
    try {
        const data = jwt.verify(token , JWT_SECRET  );
    req.user = data.user
    next();
    } catch (error) {
        res.status(401).send({error : "please authenticate useing a valid token"});

    }
    
}



module.exports = fetchuser;

