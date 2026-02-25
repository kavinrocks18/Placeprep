const DsQuestion = require('../models/DsQuestion');
const dsProblems = require('../data/dsProblems');

// @desc    Get all DS questions
// @route   GET /api/ds
// @access  Public
const getDsQuestions = async (req, res) => {
    const questions = await DsQuestion.find({}).select('-testCases -examples');
    res.status(200).json(questions);
};

// @desc    Get DS question by slug
// @route   GET /api/ds/:slug
// @access  Public
const getDsQuestionBySlug = async (req, res) => {
    const question = await DsQuestion.findOne({ slug: req.params.slug });
    if (question) {
        res.status(200).json(question);
    } else {
        res.status(404).json({ message: 'DS question not found' });
    }
};

// @desc    Get all categories
// @route   GET /api/ds/categories
// @access  Public
const getDsCategories = async (req, res) => {
    const categories = await DsQuestion.distinct('category');
    const counts = await Promise.all(
        categories.map(async (cat) => ({
            name: cat,
            count: await DsQuestion.countDocuments({ category: cat }),
        }))
    );
    res.status(200).json(counts);
};

// @desc    Seed DS questions (Dev only)
// @route   POST /api/ds/seed
// @access  Public
const seedDsQuestions = async (req, res) => {
    await DsQuestion.deleteMany({});
    await DsQuestion.insertMany(dsProblems);
    res.status(201).json({ message: `${dsProblems.length} DS questions seeded successfully` });
};

module.exports = { getDsQuestions, getDsQuestionBySlug, getDsCategories, seedDsQuestions };
