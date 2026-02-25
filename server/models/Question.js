const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
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
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    examples: [{
        input: String,
        output: String,
        explanation: String,
    }],
    testCases: [{
        input: String,
        output: String,
    }],
    starterCode: {
        type: String,
        default: '// Write your code here\n',
    },
    tags: [{
        type: String,
    }],
    constraints: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);
