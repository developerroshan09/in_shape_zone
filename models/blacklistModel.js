const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true }, // The JWT to blacklist
    createdAt: { type: Date, default: Date.now }, // when it was blacklisted
    expiresAt: { type: Date, required: true }, // token's expiration timestamp
})

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;