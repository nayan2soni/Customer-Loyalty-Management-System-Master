const express = require('express');
const router = express.Router();
const customerControllers = require('../controllers/customerControllers');
router.route('/')
    .get(customerControllers.getAllCustomers)      // Get all customers
    .post(customerControllers.createNewCustomer)   // Create a new customer
    .patch(customerControllers.updateCustomer)     // Update a customer
    .delete(customerControllers.deleteCustomer);   // Delete a customer

module.exports = router;
