const express = require('express');
const foodController = require('../controller/foodController');
const router = express.Router();
const verifyToken = require('./../../middleware/authMiddleware');
const { verify } = require('jsonwebtoken');

// External API routes (fetch from Edamam)
router.get('/api/autocomplete', verifyToken, foodController.getAutoComplete);
router.get('/api/hints', verifyToken, foodController.fetchHints);
router.get('/api/nutritions', verifyToken, foodController.fetchNutrition);

// External API routes (CRUD food info in server db)
router.post('/api/save', verify, foodController.saveFood);
router.get('/api/foods', verifyToken, foodController.fetchFoods);
router.put('/api/foods/:id', verifyToken, foodController.updateFood);
router.delete('/api/foods/:id', verifyToken, foodController.deleteFood);

module.exports = router;