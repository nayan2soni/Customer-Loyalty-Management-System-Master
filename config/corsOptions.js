// config/corsOptions.js
const allowedOrigins = require('./allowedOrigns'); // Import allowed origins list

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            // Allow requests from allowed origins or if the request is from the same origin
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies) to be sent in cross-origin requests
    optionsSuccessStatus: 200, // For legacy browsers support
};

module.exports = corsOptions;
