const mongoose = require('mongoose');

const dailyNutrientSchema = new mongoose.Schema({
     id: String,
    label: String,
    quantity: Number,
    unit: String,
    identifier: String
});

module.exports = dailyNutrientSchema;