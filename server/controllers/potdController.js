const DailyProblem = require('../models/DailyProblem');
const PotdQuestion = require('../models/PotdQuestion');
const User = require('../models/User');
const potdProblems = require('../data/potdProblems');

// Helper: get today's date as YYYY-MM-DD
const getTodayString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Helper: get yesterday's date as YYYY-MM-DD
const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
};

// @desc    Get Problem of the Day
// @route   GET /api/potd
// @access  Public
const getProblemOfTheDay = async (req, res) => {
    try {
        const today = getTodayString();

        // Check if we already have a problem for today
        let daily = await DailyProblem.findOne({ dateAssigned: today }).populate('question');

        if (!daily || !daily.question) {
            // Remove stale record if question was deleted
            if (daily && !daily.question) {
                await DailyProblem.deleteOne({ _id: daily._id });
            }

            // Auto-seed POTD questions if collection is empty
            const count = await PotdQuestion.countDocuments();
            if (count === 0) {
                await PotdQuestion.insertMany(potdProblems);
            }

            const totalCount = await PotdQuestion.countDocuments();
            if (totalCount === 0) {
                return res.status(404).json({ message: 'No POTD questions available.' });
            }

            // Get IDs of recently used problems (last 14 days) to avoid repeats
            const recentDays = [];
            for (let i = 1; i <= 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                recentDays.push(d.toISOString().split('T')[0]);
            }
            const recentProblems = await DailyProblem.find({ dateAssigned: { $in: recentDays } });
            const recentIds = recentProblems.map(p => p.question);

            // Find a question not used recently
            let question;
            if (recentIds.length < totalCount) {
                // Pick random from non-recent
                const available = await PotdQuestion.find({ _id: { $nin: recentIds } });
                question = available[Math.floor(Math.random() * available.length)];
            }
            // Fallback: pick any random question
            if (!question) {
                const randomIndex = Math.floor(Math.random() * totalCount);
                question = await PotdQuestion.findOne().skip(randomIndex);
            }

            daily = await DailyProblem.create({
                question: question._id,
                dateAssigned: today,
            });
            daily = await DailyProblem.findById(daily._id).populate('question');
        }

        res.status(200).json({
            question: daily.question,
            dateAssigned: daily.dateAssigned,
        });
    } catch (error) {
        console.error('POTD error:', error);
        res.status(500).json({ message: 'Failed to get Problem of the Day' });
    }
};

// @desc    Mark daily problem as solved + update streak
// @route   POST /api/potd/solve
// @access  Private
const solveDailyProblem = async (req, res) => {
    try {
        const today = getTodayString();
        const yesterday = getYesterdayString();
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If already solved today, no streak update
        if (user.lastSolvedDate === today) {
            return res.status(200).json({
                message: 'Already solved today',
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
            });
        }

        // Update streak
        if (user.lastSolvedDate === yesterday) {
            user.currentStreak += 1;
        } else {
            user.currentStreak = 1;
        }

        if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
        }

        user.lastSolvedDate = today;

        const { questionId } = req.body;
        if (questionId && !user.solvedQuestions.includes(questionId)) {
            user.solvedQuestions.push(questionId);
        }

        await user.save();

        res.status(200).json({
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastSolvedDate: user.lastSolvedDate,
        });
    } catch (error) {
        console.error('Solve POTD error:', error);
        res.status(500).json({ message: 'Failed to update streak' });
    }
};

// @desc    Get user streak info
// @route   GET /api/potd/streak
// @access  Private
const getStreak = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('currentStreak longestStreak lastSolvedDate');
        const today = getTodayString();
        const yesterday = getYesterdayString();

        let activeStreak = user.currentStreak;
        if (user.lastSolvedDate !== today && user.lastSolvedDate !== yesterday) {
            activeStreak = 0;
        }

        res.status(200).json({
            currentStreak: activeStreak,
            longestStreak: user.longestStreak,
            lastSolvedDate: user.lastSolvedDate,
            solvedToday: user.lastSolvedDate === today,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get streak' });
    }
};

// @desc    Get POTD question by slug
// @route   GET /api/potd/question/:slug
// @access  Public
const getPotdQuestionBySlug = async (req, res) => {
    try {
        const question = await PotdQuestion.findOne({ slug: req.params.slug });
        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({ message: 'POTD question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to get POTD question' });
    }
};

// @desc    Seed POTD questions (Dev only)
// @route   POST /api/potd/seed
// @access  Public
const seedPotdQuestions = async (req, res) => {
    try {
        await PotdQuestion.deleteMany({});
        await DailyProblem.deleteMany({});
        await PotdQuestion.insertMany(potdProblems);
        res.status(201).json({ message: `${potdProblems.length} POTD questions seeded successfully` });
    } catch (error) {
        console.error('Seed POTD error:', error);
        res.status(500).json({ message: 'Failed to seed POTD questions' });
    }
};

module.exports = { getProblemOfTheDay, solveDailyProblem, getStreak, getPotdQuestionBySlug, seedPotdQuestions };
