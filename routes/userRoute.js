// filepath: d:\BACKEND-CAFE-NODEJS\routes\userRoute.js
const express = require('express');
const router = express.Router();

// Example route
router.post("/signup", (req, res) => {
    console.log("Signup route hit!");
    console.log("Request body:", req.body);
    res.json({ message: "Signup successful!" });
  });
  

module.exports = router;