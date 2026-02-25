const mongoose = require('mongoose');

const companyRoadmapSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
        default: '',
    },
    overview: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        default: 'Technology',
    },
    difficultyLevel: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    averagePackage: {
        type: String,
        default: '',
    },
    interviewRounds: [{
        roundNumber: { type: Number, required: true },
        roundName: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, default: '' },
        tips: [String],
    }],
    importantTopics: [{
        topic: { type: String, required: true },
        tag: { type: String, enum: ['DSA', 'Core', 'HR', 'Aptitude', 'System Design'], required: true },
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    }],
    previousQuestions: [{
        question: { type: String, required: true },
        tag: { type: String, enum: ['DSA', 'Core', 'HR', 'Aptitude', 'System Design'], required: true },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
        frequency: { type: String, enum: ['Very Common', 'Common', 'Rare'], default: 'Common' },
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('CompanyRoadmap', companyRoadmapSchema);
