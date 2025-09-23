const express = require('express');
const route = express.Router();
const verifyToken = require('./../../middleware/authMiddleware')
// services and controller
const controller = require('../controller/controller');

// defining api routes and their corresponding controller functions
route.post('/api/user', controller.create);

// protected apis
route.get('/api/users', verifyToken, controller.find);
route.put('/api/users/:id', verifyToken, controller.update);
route.delete('/api/users/:id', verifyToken, controller.delete);

module.exports = route;
