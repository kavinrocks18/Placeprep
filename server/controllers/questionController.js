const Question = require('../models/Question');
const easyProblems = require('../data/easyProblems');
const mediumProblems = require('../data/mediumProblems');
const hardProblems = require('../data/hardProblems');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
    const questions = await Question.find({}).select('-testCases -examples');
    res.status(200).json(questions);
};

// @desc    Get question by slug
// @route   GET /api/questions/:slug
// @access  Public
const getQuestionBySlug = async (req, res) => {
    const question = await Question.findOne({ slug: req.params.slug });

    if (question) {
        res.status(200).json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

// @desc    Seed questions (Dev only)
// @route   POST /api/questions/seed
// @access  Public
const seedQuestions = async (req, res) => {
    await Question.deleteMany({});

    const allProblems = [...easyProblems, ...mediumProblems, ...hardProblems];

    await Question.insertMany(allProblems);
    res.status(201).json({ message: `${allProblems.length} questions seeded successfully` });
};

module.exports = {
    getQuestions,
    getQuestionBySlug,
    seedQuestions,
};
