require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if (err)
        return res.sendStatus(403); // Forbidden
        req.locals = response;
        next();
    })
}

module.exports = { authenticateToken : authenticateToken }