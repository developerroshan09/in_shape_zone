const mongoose = require('mongoose');



const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired refresh tokens

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
