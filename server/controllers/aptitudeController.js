const AptitudeQuestion = require('../models/AptitudeQuestion');
const DailyAptitude = require('../models/DailyAptitude');
const Submission = require('../models/Submission');
const aptitudeProblems = require('../data/aptitudeProblems');

const getTodayString = () => new Date().toISOString().split('T')[0];

// @desc    Get all aptitude questions (no answers)
// @route   GET /api/aptitude
const getAptitudeQuestions = async (req, res) => {
    const questions = await AptitudeQuestion.find({}).select('-correctAnswer -explanation');
    res.status(200).json(questions);
};

// @desc    Get aptitude question by slug
// @route   GET /api/aptitude/:slug
const getAptitudeBySlug = async (req, res) => {
    const question = await AptitudeQuestion.findOne({ slug: req.params.slug });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(question);
};

// @desc    Submit answer and check
// @route   POST /api/aptitude/:slug/submit
const submitAnswer = async (req, res) => {
    const question = await AptitudeQuestion.findOne({ slug: req.params.slug });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const { selectedAnswer } = req.body;
    const isCorrect = selectedAnswer === question.correctAnswer;

    // Track submission if user is authenticated
    if (req.user) {
        try {
            await Submission.create({
                user: req.user.id,
                questionType: 'aptitude',
                questionId: question._id,
                topic: question.category,
                isCorrect,
            });
        } catch (e) { /* silent fail for tracking */ }
    }

    res.status(200).json({ isCorrect, correctAnswer: question.correctAnswer, explanation: question.explanation });
};

// @desc    Get all categories with their topics
// @route   GET /api/aptitude/categories
const getCategories = async (req, res) => {
    const questions = await AptitudeQuestion.find({}).select('category topic difficulty');
    const structure = {};

    questions.forEach(q => {
        if (!structure[q.category]) structure[q.category] = {};
        if (!structure[q.category][q.topic]) structure[q.category][q.topic] = { total: 0, Easy: 0, Medium: 0, Hard: 0 };
        structure[q.category][q.topic].total++;
        structure[q.category][q.topic][q.difficulty]++;
    });

    // Convert to array format
    const result = Object.entries(structure).map(([category, topics]) => ({
        category,
        totalCount: Object.values(topics).reduce((s, t) => s + t.total, 0),
        topics: Object.entries(topics).map(([topic, counts]) => ({
            topic,
            ...counts,
        })),
    }));

    res.status(200).json(result);
};

// @desc    Get Aptitude Problem of the Day
// @route   GET /api/aptitude/potd
const getAptitudePOTD = async (req, res) => {
    try {
        const today = getTodayString();
        let daily = await DailyAptitude.findOne({ dateAssigned: today }).populate('question');

        if (!daily || !daily.question) {
            if (daily && !daily.question) await DailyAptitude.deleteOne({ _id: daily._id });

            const count = await AptitudeQuestion.countDocuments();
            if (count === 0) await AptitudeQuestion.insertMany(aptitudeProblems);

            const totalCount = await AptitudeQuestion.countDocuments();
            if (totalCount === 0) return res.status(404).json({ message: 'No aptitude questions available.' });

            const recentDays = [];
            for (let i = 1; i <= 10; i++) {
                const d = new Date(); d.setDate(d.getDate() - i);
                recentDays.push(d.toISOString().split('T')[0]);
            }
            const recent = await DailyAptitude.find({ dateAssigned: { $in: recentDays } });
            const recentIds = recent.map(p => p.question);

            let question;
            if (recentIds.length < totalCount) {
                const available = await AptitudeQuestion.find({ _id: { $nin: recentIds } });
                question = available[Math.floor(Math.random() * available.length)];
            }
            if (!question) {
                const ri = Math.floor(Math.random() * totalCount);
                question = await AptitudeQuestion.findOne().skip(ri);
            }
            daily = await DailyAptitude.create({ question: question._id, dateAssigned: today });
            daily = await DailyAptitude.findById(daily._id).populate('question');
        }

        const q = daily.question.toObject();
        const { correctAnswer, explanation, ...safeQuestion } = q;
        res.status(200).json({ question: safeQuestion, dateAssigned: daily.dateAssigned });
    } catch (error) {
        console.error('Aptitude POTD error:', error);
        res.status(500).json({ message: 'Failed to get Aptitude POTD' });
    }
};

// @desc    Seed aptitude questions
// @route   POST /api/aptitude/seed
const seedAptitudeQuestions = async (req, res) => {
    try {
        await AptitudeQuestion.deleteMany({});
        await DailyAptitude.deleteMany({});
        await AptitudeQuestion.insertMany(aptitudeProblems);
        res.status(201).json({ message: `${aptitudeProblems.length} aptitude questions seeded` });
    } catch (error) {
        console.error('Seed aptitude error:', error);
        res.status(500).json({ message: 'Failed to seed' });
    }
};

module.exports = { getAptitudeQuestions, getAptitudeBySlug, submitAnswer, getCategories, getAptitudePOTD, seedAptitudeQuestions };
