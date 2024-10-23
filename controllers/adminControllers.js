const Admin = require('../models/Admin');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all admins
// @route GET /admins
// @access Private
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find().select('-password').lean();
    if (!admins.length) {
        return res.status(404).json({ message: 'No admins found' });
    }
    res.json(admins);
});

// @desc Create new admin
// @route POST /admins
// @access Private
const createNewAdmin = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    // Validate input data
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for duplicate email or username
    const duplicate = await Admin.findOne({ 
        $or: [{ username }, { email }] 
    }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username or email.' });
    }

    // Hash the password before storing
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create a new admin record
    const admin = await Admin.create({ name, username, email, password: hashedPwd });

    if (admin) {
        res.status(201).json({ message: `New admin ${username} created.` });
    } else {
        res.status(400).json({ message: 'Invalid admin data received.' });
    }
});

// @desc Update an admin
// @route PATCH /admins
// @access Private
const updateAdmin = asyncHandler(async (req, res) => {
    const { id, name, username, email, password } = req.body;

    // Ensure all required fields are provided
    if (!id || !name || !username || !email) {
        return res.status(400).json({ message: 'All fields except password are required.' });
    }

    // Find the admin by ID
    const admin = await Admin.findById(id).exec();
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    // Check for duplicate username or email
    const duplicate = await Admin.findOne({ 
        $or: [{ username }, { email }] 
    }).lean().exec();

    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username or email.' });
    }

    // Update the admin data
    admin.name = name;
    admin.username = username;
    admin.email = email;
    if (password) {
        admin.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    const updatedAdmin = await admin.save();
    res.json({ message: `Admin ${updatedAdmin.username} updated.` });
});

// @desc Delete an admin
// @route DELETE /admins
// @access Private
const deleteAdmin = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Ensure ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required.' });
    }

    // Find the admin by ID
    const admin = await Admin.findById(id).exec();
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    const result = await admin.deleteOne();
    res.json({ message: `Admin ${result.username} deleted.` });
});

module.exports = { getAllAdmins, createNewAdmin, updateAdmin, deleteAdmin };
