const mongoose = require('mongoose');
const dotenv = require("dotenv");
const env = dotenv.config({path : "./config/config.env"});


const URI = process.env.DB_URI;

const connectToMongo = () => {
    mongoose.connect(URI , ()=>{
        console.log('connected to mongo');
    })
}

module.exports = connectToMongo;