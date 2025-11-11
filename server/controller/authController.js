// holds blacklisted token to mock logout
const Blacklist = require("../../models/blacklistModel");

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// db model
const Userdb = require('./../model/model');
const {body, validationResult } = require("express-validator");
const { success, date } = require("zod");
const RefreshToken = require("../../models/RefreshToken");

// User registration
const register = async (req, res) => {
    try {
        const { username, password, name, email } = req.body;
        
        body('email').isEmail().withMessage('Please provide a valid email');
        const errors = validationResult(req);
        console.log('errors: ' + errors.array);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, message: errors.array().map(error => error.msg).join(' ')});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Userdb({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            status: req.body.status,
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'User registered succesfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message});
    }
};

const blacklistToken = async (token) => {
    const decoded = jwt.decode(token);
    const expTimestamp = decoded.exp * 1000; // convert to milliseconds
    console.log('blacklist: ', expTimestamp);
    await Blacklist.create({
        token: token,
        expiresAt: new Date(expTimestamp),
    });
}

const logout = async (req, res) => {

    const token = req.header('Authorization');

    if (token) {
        await blacklistToken(token);
        const payload = jwt.decode(token);
        if (payload.sub) {
            await RefreshToken.deleteMany({ userId: payload.sub });
        }
    }

    // Clear the cookie
    res.cookie("jwt", "loggdout", {
        expiresAt: new Date(Date.now() + 10 * 1000),
    });

    res.status(200).json({ success: true });
};

// User login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Userdb.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed'});
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.status(200).json({ "accessToken": accessToken, "refreshToken": refreshToken,  "user": user});
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const refreshToken = async (req, res) => {
    const token = req.body.refreshToken;
    if(!token) return res.status(401);
    let payload;
    try {
        payload = jwt.verify(token, 'your_refresh_key');
    } catch (error) {
    
        if (error.name === 'TokenExpiredError') {
            console.log("⚠️ Refresh token expired:", error.expiredAt);
            return res.status(401).json({ error: "Refresh token expired. Please log in again." });
        }
        console.log("❌ JWT verification failed:", error.message);
        
        return res.status(403).json({ error: "Invalid refresh token." });
    }

    console.log('payload: ', payload)

    const storedTokens = await RefreshToken.find({ userId: payload.sub });
    const match = await Promise.any(storedTokens.map ( t => bcrypt.compare(token, t.tokenHash)))
        .catch(() => null);

    if (!match) return res.status(403);

    const user = { _id: payload.sub };
    const newAccessToken = generateAccessToken(user);
   
    await RefreshToken.deleteMany( { userId: payload.sub });
    const newRefreshToken = await generateRefreshToken(user);
    console.log(newRefreshToken);
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken, user: user });
}

function generateAccessToken(user) {
    return jwt.sign({ sub: user._id, username: user.username}, 'your_secret_key', {
            expiresIn: '30s'
        }
    );
}

async function generateRefreshToken(user) {
    const refreshToken = jwt.sign({ sub: user._id }, 'your_refresh_key', { expiresIn: '59s'});
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    console.log({
        userId: user._id,
        tokenHash: tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

    try {
        await RefreshToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
    } catch(error) {
        console.log("Error saving refresh token: ", error.message);
    }

    return refreshToken
}



module.exports = {
    register,
    logout,
    login,
    refreshToken,
}