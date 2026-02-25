const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // Quantitative, Logical Reasoning, Verbal, Data Interpretation
    topic: { type: String, required: true },     // Sub-topic e.g. "Percentage & Profit/Loss", "Coding-Decoding"
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, required: true },
    tags: [String],
    timeLimit: { type: Number, default: 120 },
}, {
    timestamps: true,
});

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
