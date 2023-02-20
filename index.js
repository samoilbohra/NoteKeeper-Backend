const express = require('express');
const connectToMongo = require('./db');
var cors = require('cors');
const app = express();
const dotenv = require("dotenv");



app.use(express.json());
app.use(cors());
const env = dotenv.config({path : "./config/config.env"});

connectToMongo();

app.use('/api/auth' , require('./routes/auth.js'));
app.use('/api/notes' , require('./routes/notes'));



app.listen(process.env.PORT , function()
{
console.log('server started at port 3000');
});