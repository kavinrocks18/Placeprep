const mongoose = require('mongoose');

const dailyAptitudeSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AptitudeQuestion',
        required: true,
    },
    dateAssigned: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('DailyAptitude', dailyAptitudeSchema);
