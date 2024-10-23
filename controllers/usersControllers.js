const User = require('../models/User')
const Admin = require('../models/Admin')
const Customer = require('../models/Customer')
const Reward = require('../models/Reward')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /api/users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();

    if (!users.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
});

// @desc Create new user
// @route POST /api/users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // Validate request data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    // Create user object
    const userObject = {
        username,
        password: hashedPwd,
        roles: Array.isArray(roles) && roles.length ? roles : ['Employee']
    };

    // Save user to database
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// @desc Update a user
// @route PATCH /api/users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    if (!id || !username || !Array.isArray(roles) || roles.length === 0 || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const duplicate = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();

    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10); // Hash new password
    }

    const updatedUser = await user.save();
    res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /api/users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();
    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};