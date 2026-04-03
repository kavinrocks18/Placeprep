const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/code', require('./routes/codeRoutes'));
app.use('/api/potd', require('./routes/potdRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/ds', require('./routes/dsRoutes'));
app.use('/api/aptitude', require('./routes/aptitudeRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/mock-test', require('./routes/mockTestRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview-gen', require('./routes/interviewGenRoutes'));

// Serve frontend in production (skip on Vercel — its CDN handles static files)
if (!process.env.VERCEL) {
    const clientDist = path.join(__dirname, '..', 'client', 'dist');
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
}

module.exports = app;
