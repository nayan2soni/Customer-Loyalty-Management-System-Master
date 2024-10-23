const express = require('express');
const router = express.Router();
const rewardControllers = require('../controllers/rewardControllers'); 

router.route('/')
    .get(rewardControllers.getAllRewards)      // Get all rewards
    .post(rewardControllers.createNewReward)   // Create a new reward
    .patch(rewardControllers.updateReward)     // Update a reward
    .delete(rewardControllers.deleteReward);   // Delete a reward

module.exports = router;
