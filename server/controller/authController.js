// holds blacklisted token to mock logout
// const blacklist = require("../../blacklist");

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// db model
const Userdb = require('./../model/model');
const {body, validationResult } = require("express-validator");

// User registration
exports.register = async (req, res) => {
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

exports.logout = (req, res) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(400).json({ error: "Token expired"});
    }

    // Add token to blacklist
    // blacklist.add(token);
    res.json({ message: "Logged out succesfully" });
};

// User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('login req username: ' + username);
        console.log('login req password: ' + password);
        const user = await Userdb.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed'});
        }
        const token = jwt.sign({ userID: user._id, jti: "ulid"}, 'your-secret-key', {
            expiresIn: '1h',
        });
        res.status(200).json({ "token": token, "user": user});
    } catch (error) {
        res.status(500).json({ error: 'Login failed'});
    }
};
