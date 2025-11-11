require('dotenv').config();

// const blacklist = require("../blacklist");
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklistModel');
const Userdb = require('../server/model/model');

async function  verifyToken(req, res, next) {
    // Extract token from headers or cookies
   const token = req.header('Authorization');
   console.log(token);
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    if (!token) {
        return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
        });
    }

    // Check if token is blacklisted
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Token is no longer valid. Please log in again"
        });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');//process.env.JWT_SECRET);

        // Check if the user still exists
        const currentUser = await Userdb.findById(decoded.sub);
        if(!currentUser) {
            return res.status(401).json({
                status: "fail",
                message: "The user belonging to this token no longer exists."
            });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: error.message});
    }
};

module.exports = verifyToken;