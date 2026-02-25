const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    company: {
        type: String,
        required: [true, 'Please add a company name'],
    },
    position: {
        type: String,
        required: [true, 'Please add a position'],
    },
    status: {
        type: String,
        enum: ['Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied',
    },
    dateApplied: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
