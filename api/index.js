const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
const app = require('../server/app');
const connectDB = require('../server/config/db');

// Connect to database (with caching for serverless)
let isConnected = false;
const ensureDbConnected = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// Wrap the app to ensure DB connection before handling requests
module.exports = async (req, res) => {
    await ensureDbConnected();
    return app(req, res);
};
