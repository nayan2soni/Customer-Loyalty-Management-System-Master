const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');

// @desc Get all customers
// @route GET /customers
// @access Private
const getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find().lean();
    if (!customers.length) {
        return res.status(400).json({ message: 'No customers found' });
    }
    res.json(customers);
});

// @desc Register a new customer
// @route POST /customers/register
// @access Public
const createNewCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;

    // Validate request data
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await Customer.findOne({ email }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    const newCustomer = await Customer.create({ name, email, phone, address });

    if (newCustomer) {
        res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
    } else {
        res.status(400).json({ message: 'Invalid customer data' });
    }
});

// @desc Update a customer
// @route PATCH /customers
// @access Private
const updateCustomer = asyncHandler(async (req, res) => {
    const { id, name, email, phone, address } = req.body;

    const customer = await Customer.findById(id).exec();
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;

    const updatedCustomer = await customer.save();
    res.json({ message: `Customer ${updatedCustomer.name} updated`, customer: updatedCustomer });
});

// @desc Delete a customer
// @route DELETE /customers
// @access Private
const deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const customer = await Customer.findById(id).exec();
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const result = await customer.deleteOne();
    res.json({ message: `Customer ${result.name} deleted` });
});

module.exports = { getAllCustomers, createNewCustomer, updateCustomer, deleteCustomer };
