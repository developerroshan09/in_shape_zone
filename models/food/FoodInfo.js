const mongoose= require('mongoose');
const Nutrient = require('./Nutrient');
const DailyNutrient = require('./DailyNutrient');
const Measure = require('./Measure');
const nutrientSchema = require('./Nutrient');
const dailyNutrientSchema = require('./DailyNutrient');
const measureSchema = require('./Measure');

const foodInfoSchema = new mongoose.Schema({
    nutrients: [nutrientSchema],
    dailyNutrients: [dailyNutrientSchema],
    measures: [measureSchema],
    calories: Number,
    totalWeight: Number,
    foodID: String,
    measureURI: String,
    unit: String,
    food: String
});

module.exports = mongoose.model('FoodInfo', foodInfoSchema);