const mongoose = require('mongoose');

const potdQuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['Medium', 'Hard'], required: true },
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

module.exports = mongoose.model('PotdQuestion', potdQuestionSchema);
