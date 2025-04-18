const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered" });

                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ messages: "Emaily Already Exist." });
            }

        }
        else {
            return res.status(500).json(err);
        }
    })

})

router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(400).json({ message: "Incorrect Username or Password" });
            }
            else if (results[0].status == 'false') {
                return res.status(400).json({ message: "Wait for Admin Approval" });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '8h' })
                res.status(200).json({ accessToken: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong.Please try again" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    const email = user.email;
    query = "select email from user where email=?";
    connection.query(query, [email], (err, results) => {
        if (!err) {
            if (results.length <= 0) 
            {

                return res.status(400).json({ message: "Email not registered" });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Password by Cafe Management System',
                    html: `<p><b>Your Login details for Cafe Management System</b><br><b>Email:</b>${results[0].email}<br><b>Password:</b>${results[0].password}<br><a href="http://localhost:5000/">Click here to login</a></p>`
                };
                transporter.sendMail(mailOptions,function (error, info) {
                    if (error) {
                        console.log(error);
                    } 
                    else {
                        console.log('Email sent: ' + info.response);

                    }
                });
                return res.status(200).json({ message: "Email sent successfully" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get',auth.authenticateToken,(req,res)=>{
    var query="select id,name,contactNumber,email,password,status,role from user where status='user'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update',auth.authenticateToken,(req,res)=>{
    let user=req.body;
    var query="update user set name=? where id=?";
    connection.query(query,[user.name,req.params.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(200).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User updated successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', (req, res) => {
    return res.status(200).jsonz({message:"true"});
})

router.post('/changePassword',(req,res)=>{
    //const
})    


module.exports = router;
