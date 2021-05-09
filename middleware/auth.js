const jwt = require('jsonwebtoken');
const config = require('../config/config').get(process.env.NODE_ENV);

const verifyToken = (req, res, next) => {
    const token = req.cookies.auth;
    let userId;

    if (!token) {
        return res.status(401).json({
            message: 'Access denied.'
        })
    }
    
    const decoded = jwt.verify(token, config.SECRET, function (err, token) {
        if (err) {
            return res.status(400).json({
                message: 'Token is not valid'
            })
        }
        return token
    });

    req.user = decoded;
    next();
}

module.exports = verifyToken;