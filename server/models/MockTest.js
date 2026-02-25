const mongoose = require('mongoose');

const questionSnapshotSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questionType: { type: String, enum: ['coding', 'aptitude'], required: true },
    title: { type: String, required: true },
    category: { type: String, default: '' },
    topic: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    // For aptitude
    options: [String],
    correctAnswer: { type: Number },
    explanation: { type: String, default: '' },
    // User's response
    selectedAnswer: { type: Number, default: -1 },
    isCorrect: { type: Boolean, default: false },
    isAttempted: { type: Boolean, default: false },
    timeTaken: { type: Number, default: 0 }, // seconds spent on this question
}, { _id: false });

const mockTestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    testType: {
        type: String,
        enum: ['aptitude', 'mixed'],
        default: 'aptitude',
    },
    totalQuestions: { type: Number, required: true },
    duration: { type: Number, required: true }, // total time in seconds
    questions: [questionSnapshotSchema],
    // Results
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'timed-out'],
        default: 'in-progress',
    },
    score: { type: Number, default: 0 },
    totalAttempted: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    // Weakness analysis
    weakTopics: [{ topic: String, category: String, correct: Number, total: Number, accuracy: Number }],
    strongTopics: [{ topic: String, category: String, correct: Number, total: Number, accuracy: Number }],
    categoryBreakdown: [{
        category: String,
        total: Number,
        attempted: Number,
        correct: Number,
        accuracy: Number,
    }],
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, {
    timestamps: true,
});

module.exports = mongoose.model('MockTest', mockTestSchema);
