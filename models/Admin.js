// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is installed

const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure email uniqueness
        },
        roles: {
            type: [String],
            default: ["Admin"]
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Hash password before saving the admin
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Avoid rehashing if the password hasn't changed
    }
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Compare entered password with the hashed password stored in the database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model to be used elsewhere in the application
module.exports = mongoose.model('Admin', AdminSchema);
