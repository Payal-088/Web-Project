const mysql = require ('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) =>{
    if(!err){
        console.log("Connected");
    }
    else{
        console.log(err);
    }    
    
});

connection.query('SHOW TABLES', (err, results) => {
    if (err) {
        console.error("Error executing query:", err.message);
    } else {
        console.log("Tables in the database:", results);
    }
});
module.exports = connection;

