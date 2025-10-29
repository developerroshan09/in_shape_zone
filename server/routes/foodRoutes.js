const express = require('express');
const foodController = require('../controller/foodController');
const router = express.Router();
const verifyToken = require('./../../middleware/authMiddleware')

// External API routes (fetch from Edamam)
router.get('/api/autocomplete', foodController.getAutoComplete);
router.get('/api/hints', verifyToken, foodController.fetchHints);
router.get('/api/nutritions', verifyToken, foodController.fetchNutrition);

module.exports = router;