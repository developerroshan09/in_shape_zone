const mongoose = require('mongoose');

const measureSchema = new mongoose.Schema({
    id: String,
    uri: String,
    label: String
});

module.exports = measureSchema;