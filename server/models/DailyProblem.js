const mongoose = require('mongoose');

const dailyProblemSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PotdQuestion',
        required: true,
    },
    dateAssigned: {
        type: String, // Store as YYYY-MM-DD for easy lookup
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('DailyProblem', dailyProblemSchema);
