
const express = require('express');
const route = express.Router();
const authController = require('./../controller/authController');

// defining apis and their corresponding controller functions
route.post('/register', authController.register);
route.post('/login', authController.login);
route.post("/logout", authController.logout);
route.post("/token/refresh", authController.refreshToken);

module.exports = route;