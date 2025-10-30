require('dotenv').config();

// const blacklist = require("../blacklist");
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklistModel');
const Userdb = require('../server/model/model');

async function  verifyToken(req, res, next) {
    // Extract token from headers or cookies
   const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    if (!token) {
        return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
        });
    }

    // Check if token is blacklisted
    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({
            status: "fail",
            message: "Token is no longer valid. Please log in again"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user still exists
        const currentUser = await Userdb.findById(decoded.userID);
        if(!currentUser) {
            return res.status(401).json({
                status: "fail",
                message: "The user belonging to this token no longer exists."
            });
        }
        req.userID = decoded.userID;
        console.log(decoded);
        next();
    } catch (error) {
        res.status(401).json({ error: error.message});
    }
};

module.exports = verifyToken;