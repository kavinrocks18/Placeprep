const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    topicName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    category: {
        type: String,
        enum: ['DSA', 'Core CS'],
        default: 'DSA',
    },
    icon: {
        type: String,
        default: '📚',
    },
    videoLinks: [{
        title: String,
        url: String, // YouTube embed URL
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Resource', resourceSchema);
