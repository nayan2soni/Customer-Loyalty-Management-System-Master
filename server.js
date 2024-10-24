require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import middleware
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import configuration files
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');

// Initialize express app and port
const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Middleware
app.use(logger); // Custom logger middleware
//app.use(cors(corsOptions)); // CORS setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies

// Serve static files from the 'public' folder
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/root')); // Root route (e.g., homepage)
app.use('/users', require('./routes/userRoutes')); // User-related routes
app.use('/admins', require('./routes/adminRoutes')); // Admin routes
app.use('/customers', require('./routes/customerRoutes')); // Customer routes
app.use('/rewards', require('./routes/rewardRoutes')); // Reward routes

// Handle non-existent routes (404)
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html')); // Serve 404 page
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});


//temp test
app.use(cors());


// Custom error handler middleware
app.use(errorHandler);

// Listen for MongoDB connection and start the server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
    console.error(err);
    logEvents(`${err.name}: ${err.message}\t${err.stack}`, 'mongoErrLog.log');
});
