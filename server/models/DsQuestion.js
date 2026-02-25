const mongoose = require('mongoose');

const dsQuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    category: { type: String, required: true }, // e.g. "Linked List", "Stack", "Tree", etc.
    description: { type: String, required: true },
    constraints: { type: String },
    tags: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String,
    }],
    starterCode: { type: String },
    testCases: [{
        input: String,
        output: String,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('DsQuestion', dsQuestionSchema);
