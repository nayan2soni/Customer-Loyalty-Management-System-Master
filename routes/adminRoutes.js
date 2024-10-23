const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers'); 

router.route('/')
    .get(adminControllers.getAllAdmins)      // Get all admins
    .post(adminControllers.createNewAdmin)   // Create a new admin
    .patch(adminControllers.updateAdmin)     // Update an admin
    .delete(adminControllers.deleteAdmin);   // Delete an admin

module.exports = router;
