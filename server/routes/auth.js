const blacklist = require("../../blacklist");

const express = require('express');
const route = express.Router();
const verifyToken = require('./../../middleware/authMiddleware');
const authController = require('./../controller/authController');

// defining apis and their corresponding controller functions
route.post('/register', authController.register);
route.post('/login', authController.login);
route.post("/logout", verifyToken, authController.logout);

module.exports = route;