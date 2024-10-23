const Reward = require('../models/Reward');
const asyncHandler = require('express-async-handler');

// @desc Get all rewards
// @route GET /rewards
// @access Private
const getAllRewards = asyncHandler(async (req, res) => {
    const rewards = await Reward.find().lean();
    if (!rewards.length) {
        return res.status(404).json({ message: 'No rewards found' });
    }
    res.json(rewards);
});

// @desc Create new reward
// @route POST /rewards
// @access Private
const createNewReward = asyncHandler(async (req, res) => {
    const { name, pointsRequired, description } = req.body;

    // Validate request data
    if (!name || !pointsRequired) {
        return res.status(400).json({ message: 'Name and pointsRequired are required.' });
    }

    // Create and save new reward
    const reward = await Reward.create({ name, pointsRequired, description });

    if (reward) {
        res.status(201).json({ message: `Reward ${name} created successfully.` });
    } else {
        res.status(400).json({ message: 'Invalid reward data received.' });
    }
});

// @desc Update a reward
// @route PATCH /rewards
// @access Private
const updateReward = asyncHandler(async (req, res) => {
    const { id, name, pointsRequired, description } = req.body;

    // Check if reward exists
    const reward = await Reward.findById(id).exec();
    if (!reward) return res.status(404).json({ message: 'Reward not found.' });

    // Update fields if provided
    if (name) reward.name = name;
    if (pointsRequired) reward.pointsRequired = pointsRequired;
    if (description) reward.description = description;

    const updatedReward = await reward.save();
    res.json({ message: `Reward ${updatedReward.name} updated successfully.` });
});

// @desc Delete a reward
// @route DELETE /rewards
// @access Private
const deleteReward = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Check if reward exists
    const reward = await Reward.findById(id).exec();
    if (!reward) return res.status(404).json({ message: 'Reward not found.' });

    const result = await reward.deleteOne();
    res.json({ message: `Reward ${result.name} deleted successfully.` });
});

module.exports = { getAllRewards, createNewReward, updateReward, deleteReward };
