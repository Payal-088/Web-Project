const express = require ('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/userRoute');



const app = express();
console.log("User routes loaded!");


app.use(cors());
app.use(express.urlencoded({extended: true }));
app.use(express.json());

//Register routes
app.use('/users', userRoute);


module.exports = app;