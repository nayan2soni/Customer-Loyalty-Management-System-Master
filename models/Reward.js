// backend/models/Reward.js
const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pointsRequired: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Reward', RewardSchema);
