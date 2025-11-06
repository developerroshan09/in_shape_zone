const mongoose = require('mongoose');

const nutrientSchema = new mongoose.Schema({
    id: String,
    label: String,
    quantity: Number,
    unit: String,
    identifier: String
});

module.exports = nutrientSchema
